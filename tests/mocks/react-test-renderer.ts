export const act = async (cb: () => Promise<any> | void) => {
  await cb();
};

export const create = (..._args: any[]) => ({
  toJSON: () => null,
});

export default { create, act };
