const store = new Map<string, string>();

const getItemAsync = jest.fn((key: string) => Promise.resolve(store.get(key) ?? null));

const setItemAsync = jest.fn((key: string, value: string) => {
  store.set(key, value);
  return Promise.resolve();
});

export const reset = () => {
  store.clear();
};

export const __store = store;
export const AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY = 'after_first_unlock';

export { getItemAsync, setItemAsync };

export default {
  getItemAsync,
  setItemAsync,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  __store,
  reset,
};
