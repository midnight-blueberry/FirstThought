import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { defineFeature, loadFeature } from 'jest-cucumber';

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
    deleteItemAsync: jest.fn((key: string) => {
      store.delete(key);
      return Promise.resolve();
    }),
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'after_first_unlock',
    __store: store,
  };
});

jest.mock('crypto-js', () => ({
  AES: {
    encrypt: (plain: string) => ({ toString: () => plain }),
    decrypt: (cipher: string) => ({ toString: () => cipher }),
  },
  enc: {
    Base64: {
      parse: (value: string) => value,
      stringify: (value: string) => value,
    },
    Utf8: {},
  },
  lib: {
    WordArray: {
      create: <T>(value: T) => value,
    },
  },
}));

import { addDiary, deleteDiary, loadDiaries, addEntry } from '@/scripts/data';

const feature = loadFeature('tests/bdd/scripts/data.feature');

type AsyncStorageMock = typeof AsyncStorage & { __storage: Map<string, string> };
type SecureStoreMock = typeof SecureStore & { __store: Map<string, string> };

interface ScenarioContext {
  diaryId?: string;
  entryId?: string;
}

const getAsyncStorageMock = (): AsyncStorageMock => AsyncStorage as unknown as AsyncStorageMock;
const getSecureStoreMock = (): SecureStoreMock => SecureStore as unknown as SecureStoreMock;

const seedEncryptionKey = async () => {
  getAsyncStorageMock().__storage.clear();
  getSecureStoreMock().__store.clear();
  await SecureStore.setItemAsync('enc_key', 'dummy');
};

const ensureDiaryId = (context: ScenarioContext): string => {
  if (!context.diaryId) {
    throw new Error('diaryId не установлен в сценарии');
  }

  return context.diaryId;
};

const ensureEntryId = (context: ScenarioContext): string => {
  if (!context.entryId) {
    throw new Error('entryId не установлен в сценарии');
  }

  return context.entryId;
};

defineFeature(feature, (test) => {
  test('addDiary добавляет новый дневник', ({ given, when, then }) => {
    const context: ScenarioContext = {};

    given('очищены AsyncStorage и SecureStore и записан ключ шифрования', async () => {
      await seedEncryptionKey();
    });

    when(/^я создаю дневник "(.+)"$/, async (title: string) => {
      const diary = await addDiary(title);
      context.diaryId = diary.id;
    });

    then(
      /^список дневников имеет длину (\d+) и заголовок первого равен "(.+)"$/, 
      async (length: string, expectedTitle: string) => {
        const diaries = await loadDiaries();
        expect(diaries).toHaveLength(Number(length));
        expect(diaries[0]?.title).toBe(expectedTitle);
        if (context.diaryId) {
          expect(diaries[0]?.id).toBe(context.diaryId);
        }
      }
    );
  });

  test('deleteDiary удаляет дневник и связанные записи', ({ given, when, then }) => {
    const context: ScenarioContext = {};

    given('очищены AsyncStorage и SecureStore и записан ключ шифрования', async () => {
      await seedEncryptionKey();
    });

    when(
      /^я создаю дневник "(.+)" и добавляю запись "(.+)", затем удаляю этот дневник$/, 
      async (title: string, entryText: string) => {
        const diary = await addDiary(title);
        context.diaryId = diary.id;

        const entryId = await addEntry(diary.id, { text: entryText });
        context.entryId = entryId;

        const storedEntry = await AsyncStorage.getItem(`record_${entryId}`);
        expect(storedEntry).not.toBeNull();

        await deleteDiary(diary.id);
      }
    );

    then(
      "список дневников пуст, `record_<entryId>` и `__enc_entry_ids_<diaryId>` в AsyncStorage отсутствуют",
      async () => {
        const diaries = await loadDiaries();
        expect(diaries).toHaveLength(0);

        const entryId = ensureEntryId(context);
        const diaryId = ensureDiaryId(context);

        await expect(AsyncStorage.getItem(`record_${entryId}`)).resolves.toBeNull();
        await expect(AsyncStorage.getItem(`__enc_entry_ids_${diaryId}`)).resolves.toBeNull();
      }
    );
  });
});
