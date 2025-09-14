import React from 'react';
// @ts-ignore
import ReactDOMServer from 'react-dom/server';

export const act = async (cb: () => Promise<any> | void) => {
  await cb();
};

export const create = (element: React.ReactElement) => {
  ReactDOMServer.renderToString(element);
  return {
    toJSON: () => null,
    unmount: () => {},
  };
};

export default { create, act };
