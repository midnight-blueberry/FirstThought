const path = require('path');

module.exports = {
  process(_src, filename) {
    const absoluteFeaturePath = path.resolve(filename);
    const stepsPath = filename.replace(/\.feature$/, '.steps');

    const code = [
      "const { loadFeature, defineFeature } = require('jest-cucumber');",
      `const feature = loadFeature(${JSON.stringify(absoluteFeaturePath)});`,
      `const defineSteps = require(${JSON.stringify(stepsPath)});`,
      'defineFeature(feature, defineSteps.default || defineSteps);'
    ].join('\n');

    return { code };
  }
};
