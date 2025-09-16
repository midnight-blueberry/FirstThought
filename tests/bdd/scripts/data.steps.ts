import { jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { addDiary, deleteDiary, loadDiaries, addEntry } from '@/scripts/data';

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
    decrypt: (cipher: string) => ({ toString: () => cipher }),
  },
  enc: {
    Base64: {
      parse: (str: string) => str,
      stringify: (str: string) => str,
    },
    Utf8: {},
  },
  lib: {
    WordArray: {
      create: (bytes: Uint8Array) => bytes,
    },
  },
}));

const feature = loadFeature('tests/bdd/scripts/data.feature');

type StepImplementation = (...args: any[]) => void | Promise<void>;
type StepDefinition = (matcher: string | RegExp, stepImplementation: StepImplementation) => void;

interface StepDefinitions {
  given: StepDefinition;
  when: StepDefinition;
  then: StepDefinition;
}

interface ScenarioContext {
  diaryId?: string;
  entryId?: string;
}

const getAsyncStorageInternal = () =>
  (AsyncStorage as unknown as { __storage: Map<string, string> }).__storage;

const getSecureStoreInternal = () =>
  (SecureStore as unknown as { __store: Map<string, string> }).__store;

const requireValue = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) {
    throw new Error(message);
  }

  return value;
};

const registerStorageResetStep = (given: StepDefinition, context: ScenarioContext) => {
  given('очищены AsyncStorage и SecureStore и записан ключ шифрования', async () => {
    getAsyncStorageInternal().clear();
    getSecureStoreInternal().clear();

    context.diaryId = undefined;
    context.entryId = undefined;

    await SecureStore.setItemAsync('enc_key', 'dummy');
  });
};

defineFeature(feature, (test) => {
  test('addDiary добавляет новый дневник', ({ given, when, then }: StepDefinitions) => {
    const context: ScenarioContext = {};

    registerStorageResetStep(given, context);

    when(/^я создаю дневник "([^"]+)"$/, async (title: string) => {
      const diary = await addDiary(title);
      context.diaryId = diary.id;
    });

    then(
      /^список дневников имеет длину (\d+) и заголовок первого равен "([^"]+)"$/,
      async (expectedLength: string, expectedTitle: string) => {
        const diaries = await loadDiaries();
        expect(diaries).toHaveLength(Number(expectedLength));

        const firstDiary = diaries[0];
        expect(firstDiary?.title).toBe(expectedTitle);

        if (context.diaryId) {
          expect(firstDiary?.id).toBe(context.diaryId);
        }
      },
    );
  });

  test('deleteDiary удаляет дневник и связанные записи', ({ given, when, then }: StepDefinitions) => {
    const context: ScenarioContext = {};

    registerStorageResetStep(given, context);

    when(
      /^я создаю дневник "([^"]+)" и добавляю запись "([^"]+)", затем удаляю этот дневник$/,
      async (title: string, text: string) => {
        const diary = await addDiary(title);
        context.diaryId = diary.id;

        const entryId = await addEntry(diary.id, { text });
        context.entryId = entryId;

        const entryKey = `record_${entryId}`;
        const storedEntry = await AsyncStorage.getItem(entryKey);
        expect(storedEntry).not.toBeNull();

        await deleteDiary(diary.id);
      },
    );

    then(
      'список дневников пуст, record_<entryId> и __enc_entry_ids_<diaryId> в AsyncStorage отсутствуют',
      async () => {
        const diaries = await loadDiaries();
        expect(diaries).toHaveLength(0);

        const diaryId = requireValue(context.diaryId, 'Не удалось получить идентификатор дневника');
        const entryId = requireValue(context.entryId, 'Не удалось получить идентификатор записи');

        const entryKey = `record_${entryId}`;
        const entryValue = await AsyncStorage.getItem(entryKey);
        expect(entryValue).toBeNull();

        const indexKey = `__enc_entry_ids_${diaryId}`;
        const indexValue = await AsyncStorage.getItem(indexKey);
        expect(indexValue).toBeNull();
      },
    );
  });
});
