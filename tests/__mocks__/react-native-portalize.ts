import React from 'react';
export const Portal = ({ children }: { children?: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);
export default { Portal };
