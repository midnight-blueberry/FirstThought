import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

let errorSpy: jest.SpyInstance;

const DIARIES_KEY = '__encrypted_diaries__';

beforeAll(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockClear();
});

afterAll(() => {
  errorSpy.mockRestore();
});

// Mock AsyncStorage
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

// Mock SecureStore
jest.mock('expo-secure-store', () => require('../mocks/expoSecureStoreMock'));

// Mock crypto helpers to bypass encryption in data tests
jest.mock('@utils/crypto', () => {
  let counter = 0;
  return {
    encrypt: jest.fn(async (plain: string) => plain),
    decrypt: jest.fn(async (cipher: string) => cipher),
    generateId: jest.fn(() => `id_${(counter += 1)}`),
    generateKey: jest.fn(async () => Promise.resolve()),
  };
});

import {
  addDiary,
  deleteDiary,
  loadDiaries,
  addEntry,
  loadEntry,
  modifyEntry,
  deleteEntry,
  moveEntry,
} from '@/scripts/data';
import { loadEntryIds } from '@utils/storage';
import type { DiaryMeta } from '@/types/data';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  beforeEach(async () => {
    (AsyncStorage as unknown as { __storage: Map<string, string> }).__storage.clear();
    (SecureStore as unknown as { __store: Map<string, string> }).__store.clear();
    await SecureStore.setItemAsync('enc_key', 'dummy');
  });

  test('adding a diary saves it and it appears in the list', ({ given, when, then }: StepDefinitions) => {
    let diary: DiaryMeta | null = null;
    let list: DiaryMeta[] = [];

    given(/^a diary "(.+)" is created$/, async (title: string) => {
      diary = await addDiary(title);
    });

    when('the diary list is loaded', async () => {
      list = await loadDiaries();
    });

    then('the diary appears in the list', () => {
      expect(diary).not.toBeNull();
      expect(diary!.title).toBe('My Diary');
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(diary!.id);
    });
  });

  test('deleting a diary removes the diary and related entries', ({ given, when, then }: StepDefinitions) => {
    let diary: DiaryMeta | null = null;
    let entryId = '';

    given(/^a diary "(.+)" with an entry is created$/, async (title: string) => {
      diary = await addDiary(title);
      entryId = await addEntry(diary.id, { text: 'hello' });
      expect(await AsyncStorage.getItem(`record_${entryId}`)).not.toBeNull();
    });

    when('the diary is deleted', async () => {
      await deleteDiary(diary!.id);
    });

    then('the diary and related data are removed from storage', async () => {
      const list = await loadDiaries();
      expect(list).toHaveLength(0);
      expect(await AsyncStorage.getItem(`record_${entryId}`)).toBeNull();
      expect(await AsyncStorage.getItem(`__enc_entry_ids_${diary!.id}`)).toBeNull();
    });
  });

  test('adding an entry saves it, indexes it, and it can be loaded', ({ given, when, then, and }: StepDefinitions) => {
    let diary: DiaryMeta | null = null;
    let entryId = '';
    const data = { text: 'entry text', mood: 'happy' };

    given(/^a diary "(.+)" is created$/, async (title: string) => {
      diary = await addDiary(title);
    });

    when('an entry is added to the diary', async () => {
      entryId = await addEntry(diary!.id, data);
    });

    then('the entry can be loaded with its original data', async () => {
      const loaded = await loadEntry<typeof data>(entryId);
      expect(loaded).toEqual(data);
    });

    and('the diary entry ids include the entry id', async () => {
      const ids = await loadEntryIds(diary!.id);
      expect(ids).toContain(entryId);
    });
  });

  test('modifying an entry updates stored data', ({ given, when, then }: StepDefinitions) => {
    let diary: DiaryMeta | null = null;
    let entryId = '';
    const original = { text: 'original', mood: 'ok', keep: true };

    given(/^a diary "(.+)" with an entry is created$/, async (title: string) => {
      diary = await addDiary(title);
      entryId = await addEntry(diary!.id, original);
    });

    when('the entry is modified with new data', async () => {
      await modifyEntry<typeof original>(diary!.id, entryId, { mood: 'great', extra: 1 });
    });

    then('the entry reflects the updated data while keeping other fields', async () => {
      const loaded = await loadEntry<typeof original>(entryId);
      expect(loaded).toEqual({ text: 'original', mood: 'great', keep: true, extra: 1 });
    });
  });

  test('deleting an entry removes it and updates index', ({ given, when, then }: StepDefinitions) => {
    let diary: DiaryMeta | null = null;
    let entryId = '';

    given(/^a diary "(.+)" with an entry is created$/, async (title: string) => {
      diary = await addDiary(title);
      entryId = await addEntry(diary!.id, { text: 'to delete' });
    });

    when('the entry is deleted', async () => {
      await deleteEntry(diary!.id, entryId);
    });

    then('the entry is removed and the diary index is updated', async () => {
      expect(await loadEntry(entryId)).toBeNull();
      const ids = await loadEntryIds(diary!.id);
      expect(ids).not.toContain(entryId);
    });
  });

  test('moving an entry updates diary indices', ({ given, and, when, then }: StepDefinitions) => {
    let fromDiary: DiaryMeta | null = null;
    let toDiary: DiaryMeta | null = null;
    let entryId = '';

    given('two diaries exist', async () => {
      fromDiary = await addDiary('From');
      toDiary = await addDiary('To');
    });

    and('the first diary has an entry', async () => {
      entryId = await addEntry(fromDiary!.id, { text: 'move me' });
    });

    when('the entry is moved to the second diary', async () => {
      await moveEntry(fromDiary!.id, toDiary!.id, entryId);
    });

    then('the entry id is removed from the first diary index', async () => {
      const ids = await loadEntryIds(fromDiary!.id);
      expect(ids).not.toContain(entryId);
    });

    and('the entry id is added to the second diary index', async () => {
      const ids = await loadEntryIds(toDiary!.id);
      expect(ids).toContain(entryId);
    });
  });

  test('loading diaries fails on invalid stored data', ({ given, when, then }: StepDefinitions) => {
    let loadError: Error | null = null;

    given('invalid data is stored for diaries', async () => {
      await AsyncStorage.setItem(DIARIES_KEY, JSON.stringify({ foo: 'bar' }));
    });

    when('the diary list is loaded', async () => {
      try {
        await loadDiaries();
      } catch (err) {
        loadError = err as Error;
      }
    });

    then('loading diaries fails with an invalid data error', () => {
      expect(loadError).not.toBeNull();
      expect(loadError!.message).toBe('Invalid diaries data');
    });
  });
};
