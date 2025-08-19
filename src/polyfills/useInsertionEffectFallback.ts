import React from 'react';

// Styled-components uses `useInsertionEffect` internally which is
// not fully supported in React Native and leads to warnings when it
// schedules state updates. We alias it to `useEffect` to avoid the
// "useInsertionEffect must not schedule updates" warning.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - overriding readonly property is intentional here
React.useInsertionEffect = React.useEffect;
