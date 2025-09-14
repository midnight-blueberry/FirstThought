export const loadFeature = (_path: string) => ({} as any);
export const defineFeature = (_feature: any, cb: any) => {
  const runScenario = (title: string, steps: any) => {
    test(title, () => {
      steps({
        given: (_p: any, fn: any) => fn(),
        when: (_p: any, fn: any) => fn(),
        then: (_p: any, fn: any) => fn(),
      });
    });
  };
  cb(runScenario);
};
export default { loadFeature, defineFeature };
