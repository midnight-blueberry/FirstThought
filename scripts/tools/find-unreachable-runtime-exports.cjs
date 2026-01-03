#!/usr/bin/env node
/*
 * Generate a report of value exports from src/** that are not used by runtime code (app/** + src/**).
 * References from tests/**, scripts/**, vendor/** and .expo/** are ignored.
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..', '..');
const RUNTIME_PREFIXES = [
  `${path.sep}src${path.sep}`,
  `${path.sep}app${path.sep}`,
];
const IGNORED_PREFIXES = [
  `${path.sep}tests${path.sep}`,
  `${path.sep}scripts${path.sep}`,
  `${path.sep}vendor${path.sep}`,
  `${path.sep}.expo${path.sep}`,
];

function isWithinRuntime(filePath) {
  return RUNTIME_PREFIXES.some(prefix => filePath.includes(prefix));
}

function isIgnored(filePath) {
  return IGNORED_PREFIXES.some(prefix => filePath.includes(prefix));
}

function loadTsConfig() {
  const configPath = path.join(ROOT, 'tsconfig.json');
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext([configFile.error], {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
      getCanonicalFileName: fileName => fileName,
    }));
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    ROOT,
    undefined,
    configPath
  );

  if (parsed.errors.length) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext(parsed.errors, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
      getCanonicalFileName: fileName => fileName,
    }));
  }

  return parsed;
}

function createLanguageService(parsedConfig) {
  const fileVersions = new Map(parsedConfig.fileNames.map(fileName => [fileName, 0]));

  const servicesHost = {
    getScriptFileNames: () => parsedConfig.fileNames,
    getScriptVersion: fileName => fileVersions.get(fileName)?.toString() ?? '0',
    getScriptSnapshot: fileName => {
      if (!fs.existsSync(fileName)) return undefined;
      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName, 'utf8'));
    },
    getCurrentDirectory: () => ROOT,
    getCompilationSettings: () => parsedConfig.options,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };

  return ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
}

function getSymbolKind(symbol) {
  const target = symbol.flags & ts.SymbolFlags.Alias ? ts.SymbolFlags.Alias : symbol.flags;

  if (target & ts.SymbolFlags.Function) return 'function';
  if (target & ts.SymbolFlags.Class) return 'class';
  if (target & ts.SymbolFlags.Enum) return 'enum';
  if (target & ts.SymbolFlags.Variable) return 'variable';
  if (target & ts.SymbolFlags.ValueModule) return 'namespace';
  return 'value';
}

function getNameNodeForSymbol(symbol) {
  const declarations = symbol.getDeclarations() || [];

  for (const decl of declarations) {
    if (ts.isExportSpecifier(decl)) {
      return decl.name || decl.propertyName || null;
    }

    if (ts.isExportAssignment(decl) && ts.isIdentifier(decl.expression)) {
      return decl.expression;
    }

    if ('name' in decl && decl.name && (ts.isIdentifier(decl.name) || ts.isStringLiteral(decl.name))) {
      return decl.name;
    }
  }

  return null;
}

function collectExports(program, checker) {
  const exports = [];

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue;
    if (!sourceFile.fileName.includes(`${path.sep}src${path.sep}`)) continue;

    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) continue;

    for (const exportSymbol of checker.getExportsOfModule(moduleSymbol)) {
      const targetSymbol =
        exportSymbol.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(exportSymbol)
          : exportSymbol;

      if (!(targetSymbol.flags & ts.SymbolFlags.Value)) continue;

      const nameNode = getNameNodeForSymbol(exportSymbol) || getNameNodeForSymbol(targetSymbol);
      if (!nameNode) continue;

      exports.push({
        name: exportSymbol.getName(),
        kind: getSymbolKind(targetSymbol),
        fileName: sourceFile.fileName,
        node: nameNode,
      });
    }
  }

  return exports;
}

function hasRuntimeReferences(languageService, exportInfo) {
  const { fileName, node } = exportInfo;
  const position = node.getStart();
  const references = languageService.getReferencesAtPosition(fileName, position) || [];

  return references.some(ref => {
    if (ref.isDefinition) return false;
    if (isIgnored(ref.fileName)) return false;
    return isWithinRuntime(ref.fileName);
  });
}

function formatReport(unusedExports) {
  const lines = [
    '# Unreachable runtime exports',
    '',
    'Generated by `scripts/tools/find-unreachable-runtime-exports.cjs`.',
    '',
  ];

  const files = Array.from(unusedExports.keys()).sort();

  for (const file of files) {
    lines.push(`## ${path.relative(ROOT, file)}`);
    const entries = unusedExports.get(file) || [];
    entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(entry => {
        lines.push(`- ${entry.name} (${entry.kind})`);
      });
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const parsedConfig = loadTsConfig();
  const languageService = createLanguageService(parsedConfig);
  const program = languageService.getProgram();

  if (!program) {
    throw new Error('Failed to create TypeScript program');
  }

  const checker = program.getTypeChecker();
  const exports = collectExports(program, checker);
  const unusedByFile = new Map();

  for (const exp of exports) {
    if (hasRuntimeReferences(languageService, exp)) continue;

    const list = unusedByFile.get(exp.fileName) || [];
    list.push(exp);
    unusedByFile.set(exp.fileName, list);
  }

  const output = formatReport(unusedByFile);
  const docsDir = path.join(ROOT, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }
  const outputPath = path.join(docsDir, 'unreachable-runtime-exports.md');
  fs.writeFileSync(outputPath, output);

  console.log(`Report written to ${outputPath}`);
}

main();
