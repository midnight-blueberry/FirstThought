import AsyncStorage from '@react-native-async-storage/async-storage';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as SecureStore from 'expo-secure-store';

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
    decrypt: (cipher: string) => ({ toString: () => cipher }),
  },
  enc: {
    Base64: {
      parse: (str: string) => str,
      stringify: (value: string) => value,
    },
    Utf8: {},
  },
  lib: {
    WordArray: {
      create: (bytes: Uint8Array) => bytes,
    },
  },
}));

import { addDiary, deleteDiary, loadDiaries, addEntry } from '@/scripts/data';

const feature = loadFeature('tests/bdd/scripts/data.feature');

type StepDefinition = (
  matcher: string | RegExp,
  stepImplementation: (...args: any[]) => void | Promise<void>,
) => void;

interface StepDefinitions {
  given: StepDefinition;
  when: StepDefinition;
  then: StepDefinition;
}

interface ScenarioContext {
  diaryId?: string;
  entryId?: string;
}

const clearStorages = async () => {
  (AsyncStorage as unknown as { __storage: Map<string, string> }).__storage.clear();
  (SecureStore as unknown as { __store: Map<string, string> }).__store.clear();
};

defineFeature(feature, (test) => {
  test('addDiary добавляет новый дневник', ({ given, when, then }: StepDefinitions) => {
    const context: ScenarioContext = {};

    given('очищены AsyncStorage и SecureStore и записан ключ шифрования', async () => {
      await clearStorages();
      context.diaryId = undefined;
      context.entryId = undefined;
      await SecureStore.setItemAsync('enc_key', 'dummy');
    });

    when(/^я создаю дневник "([^"]+)"$/, async (title: string) => {
      const diary = await addDiary(title);
      context.diaryId = diary.id;
    });

    then(
      /^список дневников имеет длину (\d+) и заголовок первого равен "([^"]+)"$/,
      async (expectedLength: string, expectedTitle: string) => {
        const diaries = await loadDiaries();
        expect(diaries).toHaveLength(Number(expectedLength));
        expect(diaries[0]?.title).toBe(expectedTitle);
        if (context.diaryId) {
          expect(diaries[0]?.id).toBe(context.diaryId);
        }
      },
    );
  });

  test('deleteDiary удаляет дневник и связанные записи', ({ given, when, then }: StepDefinitions) => {
    const context: ScenarioContext = {};

    given('очищены AsyncStorage и SecureStore и записан ключ шифрования', async () => {
      await clearStorages();
      context.diaryId = undefined;
      context.entryId = undefined;
      await SecureStore.setItemAsync('enc_key', 'dummy');
    });

    when(
      /^я создаю дневник "([^"]+)" и добавляю запись "([^"]+)", затем удаляю этот дневник$/,
      async (title: string, entryText: string) => {
        const diary = await addDiary(title);
        context.diaryId = diary.id;

        const entryId = await addEntry(diary.id, { text: entryText });
        context.entryId = entryId;

        const recordKey = `record_${entryId}`;
        expect(await AsyncStorage.getItem(recordKey)).not.toBeNull();

        await deleteDiary(diary.id);
      },
    );

    then(
      'список дневников пуст, `record_<entryId>` и `__enc_entry_ids_<diaryId>` в AsyncStorage отсутствуют',
      async () => {
        const diaries = await loadDiaries();
        expect(diaries).toHaveLength(0);

        if (!context.entryId || !context.diaryId) {
          throw new Error('Не сохранены идентификаторы дневника или записи');
        }

        const recordKey = `record_${context.entryId}`;
        const entryIdsKey = `__enc_entry_ids_${context.diaryId}`;

        expect(await AsyncStorage.getItem(recordKey)).toBeNull();
        expect(await AsyncStorage.getItem(entryIdsKey)).toBeNull();
      },
    );
  });
});
