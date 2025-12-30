export type StepDefinitions = {
  given: (...args: any[]) => any;
  when: (...args: any[]) => any;
  then: (...args: any[]) => any;
};

export type JestCucumberTestFn = (title: string, fn: (steps: StepDefinitions) => any) => void;
