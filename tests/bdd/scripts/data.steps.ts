import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { defineFeature, loadFeature } from 'jest-cucumber';

let errorSpy: jest.SpyInstance;

beforeAll(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockClear();
});

afterAll(() => {
  errorSpy.mockRestore();
});

jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = new Map<string, string>();
  return {
    getItem: jest.fn((key: string) => Promise.resolve(storage.get(key) ?? null)),
    setItem: jest.fn((key: string, value: string) => {
      storage.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      storage.delete(key);
      return Promise.resolve();
    }),
    __storage: storage,
  };
});

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    setItemAsync: jest.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'after_first_unlock',
    __store: store,
  };
});

jest.mock('crypto-js', () => ({
  AES: {
    encrypt: (plain: string) => ({ toString: () => plain }),
    decrypt: (cipher: string) => ({
      toString: () => cipher,
    }),
  },
  enc: {
    Base64: {
      parse: (str: string) => str,
    },
    Utf8: {},
  },
}));

import { addDiary, deleteDiary, loadDiaries, addEntry } from '@/scripts/data';

const feature = loadFeature('tests/bdd/scripts/data.feature');

type StepDefinitions = {
  given: any;
  when: any;
  then: any;
};

const resetStorages = async () => {
  (AsyncStorage as unknown as { __storage: Map<string, string> }).__storage.clear();
  (SecureStore as unknown as { __store: Map<string, string> }).__store.clear();
  await SecureStore.setItemAsync('enc_key', 'dummy');
};

defineFeature(feature, (test: any) => {
  test('addDiary добавляет новый дневник', ({ given, when, then }: StepDefinitions) => {
    given('очищены AsyncStorage и SecureStore и записан ключ шифрования', async () => {
      await resetStorages();
    });

    when(/^я создаю дневник "([^"]+)"$/, async (title: string) => {
      await addDiary(title);
    });

    then(
      /^список дневников имеет длину (\d+) и заголовок первого равен "([^"]+)"$/,
      async (expectedLength: string, expectedTitle: string) => {
        const list = await loadDiaries();
        expect(list).toHaveLength(Number(expectedLength));
        expect(list[0]?.title).toBe(expectedTitle);
      }
    );
  });

  test(
    'deleteDiary удаляет дневник и связанные записи',
    ({ given, when, then }: StepDefinitions) => {
      let diaryId = '';
      let entryId = '';

      given('очищены AsyncStorage и SecureStore и записан ключ шифрования', async () => {
        await resetStorages();
      });

      when(
        /^я создаю дневник "([^"]+)" и добавляю запись "([^"]+)", затем удаляю этот дневник$/,
        async (title: string, entryText: string) => {
          const diary = await addDiary(title);
          diaryId = diary.id;
          entryId = await addEntry(diaryId, { text: entryText });

          const recordKey = `record_${entryId}`;
          expect(await AsyncStorage.getItem(recordKey)).not.toBeNull();

          await deleteDiary(diaryId);
        }
      );

      then(
        'список дневников пуст, `record_<entryId>` и `__enc_entry_ids_<diaryId>` в AsyncStorage отсутствуют',
        async () => {
          const list = await loadDiaries();
          expect(list).toHaveLength(0);
          expect(await AsyncStorage.getItem(`record_${entryId}`)).toBeNull();
          expect(await AsyncStorage.getItem(`__enc_entry_ids_${diaryId}`)).toBeNull();
        }
      );
    }
  );
});
