import React from 'react';

/**
 * React 19 introduces `useInsertionEffect`, which is intended for injecting
 * styles and must not schedule state updates. Some third‑party libraries used
 * in this project haven't been updated yet and trigger warnings by calling
 * state setters during this phase.  Until those libraries are fixed upstream,
 * we alias `useInsertionEffect` to `useLayoutEffect` to silence the warning and
 * preserve the previous behaviour.
 */
 
if (typeof (React as any).useInsertionEffect === 'function') {
  (React as any).useInsertionEffect = React.useLayoutEffect as any;
}

export {}; // ensure this file is treated as a module
