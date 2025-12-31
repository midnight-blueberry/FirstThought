const storage = new Map<string, string>();

const getItem = jest.fn((key: string) => Promise.resolve(storage.get(key) ?? null));

const setItem = jest.fn((key: string, value: string) => {
  storage.set(key, value);
  return Promise.resolve();
});

const removeItem = jest.fn((key: string) => {
  storage.delete(key);
  return Promise.resolve();
});

export const reset = () => {
  storage.clear();
};

export const __storage = storage;

export { getItem, setItem, removeItem };

export default {
  getItem,
  setItem,
  removeItem,
  __storage,
  reset,
};
