import AsyncStorage from '@react-native-async-storage/async-storage';
import { entryIdsKey, loadEntryIds, saveEntryIds } from '@/utils/storage';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const encryptMock = jest.fn(async (plain: string) => `cipher:${plain}`);
const decryptMock = jest.fn(async (cipher: string) => cipher);

jest.mock('@react-native-async-storage/async-storage', () => require('../mocks/asyncStorageMock'));

jest.mock('@utils/crypto', () => ({
  encrypt: encryptMock,
  decrypt: decryptMock,
}));

type CoreSteps = Pick<StepDefinitions, 'given' | 'when' | 'then'>;

type AsyncStorageMock = {
  __storage: Map<string, string>;
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
};

export default (test: JestCucumberTestFn) => {
  beforeEach(() => {
    const storage = AsyncStorage as unknown as AsyncStorageMock;
    storage.__storage.clear();
    storage.getItem.mockClear();
    storage.setItem.mockClear();
    storage.removeItem.mockClear();
    encryptMock.mockClear();
    decryptMock.mockClear();
  });

  test('entryIdsKey returns prefixed key for diary id', ({ given, when, then }: CoreSteps) => {
    const state = { diaryId: '', key: '' };

    given(/^a diary id "(.+)"$/, (id: string) => {
      state.diaryId = id;
    });

    when('I build the entry ids key', () => {
      state.key = entryIdsKey(state.diaryId);
    });

    then(/^the key is "(.+)"$/, (expected: string) => {
      expect(state.key).toBe(expected);
    });
  });

  test('loadEntryIds returns an empty array when storage is missing', ({
    given,
    when,
    then,
  }: CoreSteps) => {
    const state: { diaryId: string; result: string[] } = { diaryId: '', result: [] };

    given(/^no entry ids are stored for diary "(.+)"$/, (diaryId: string) => {
      state.diaryId = diaryId;
    });

    when('I load the entry ids', async () => {
      state.result = await loadEntryIds(state.diaryId);
    });

    then('the result is an empty list', () => {
      expect(state.result).toEqual([]);
    });

    then('decrypt is not called', () => {
      expect(decryptMock).not.toHaveBeenCalled();
    });
  });

  test('loadEntryIds returns parsed entry ids when stored value exists', ({
    given,
    when,
    then,
  }: CoreSteps) => {
    const state: { diaryId: string; cipher: string; expected: string[]; result: string[] } = {
      diaryId: '',
      cipher: '',
      expected: [],
      result: [],
    };

    given(
      /^encrypted entry ids "(.+)" for diary "(.+)" decrypting to "(.+)"$/,
      (cipher: string, diaryId: string, decrypted: string) => {
        state.diaryId = diaryId;
        state.cipher = cipher;
        state.expected = JSON.parse(decrypted);
        const storage = AsyncStorage as unknown as AsyncStorageMock;
        storage.__storage.set(entryIdsKey(state.diaryId), cipher);
        decryptMock.mockResolvedValueOnce(decrypted);
      },
    );

    when('I load the entry ids', async () => {
      state.result = await loadEntryIds(state.diaryId);
    });

    then('the result matches the decrypted entry ids', () => {
      expect(state.result).toEqual(state.expected);
    });

    then('decrypt is called with the stored cipher text', () => {
      expect(decryptMock).toHaveBeenCalledWith(state.cipher);
    });
  });

  test('saveEntryIds encrypts and stores entry ids', ({ given, when, then }: CoreSteps) => {
    const state: { diaryId: string; ids: string[]; cipher: string } = {
      diaryId: '',
      ids: [],
      cipher: 'cipher_text',
    };

    given(/^entry ids "(.+)" for diary "(.+)"$/, (ids: string, diaryId: string) => {
      state.diaryId = diaryId;
      state.ids = JSON.parse(ids);
      encryptMock.mockResolvedValueOnce(state.cipher);
    });

    when('I save the entry ids', async () => {
      await saveEntryIds(state.diaryId, state.ids);
    });

    then('encrypt is called with the JSON string', () => {
      expect(encryptMock).toHaveBeenCalledWith(JSON.stringify(state.ids));
    });

    then('AsyncStorage stores the cipher text under the entry ids key', () => {
      const storage = AsyncStorage as unknown as AsyncStorageMock;
      const key = entryIdsKey(state.diaryId);
      expect(storage.__storage.get(key)).toBe(state.cipher);
      expect(storage.setItem).toHaveBeenCalledWith(key, state.cipher);
    });
  });
};
