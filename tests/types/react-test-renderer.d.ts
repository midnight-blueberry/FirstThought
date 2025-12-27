declare module 'react-test-renderer' {
  import * as React from 'react';

  export interface ReactTestRenderer {
    update(element: React.ReactElement): void;
    unmount(): void;
    root: any;
  }

  export function create(element: React.ReactElement): ReactTestRenderer;
  export function act(callback: () => void | Promise<void>): void | Promise<void>;

  const ReactTestRenderer: {
    create: typeof create;
    act: typeof act;
  };

  export default ReactTestRenderer;
}
