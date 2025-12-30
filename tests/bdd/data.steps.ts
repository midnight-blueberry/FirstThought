import AsyncStorage from '@react-native-async-storage/async-storage';
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
  addEntry,
  deleteDiary,
  deleteEntry,
  loadDiaries,
  loadEntry,
  modifyEntry,
  moveEntry,
} from '@/scripts/data';
import type { DiaryMeta, EntryData } from '@/types/data';
import { loadEntryIds } from '@/utils/storage';
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

  test('adding an entry saves it, indexes it, and it can be loaded', ({ given, and, when, then }: StepDefinitions) => {
    let diary: DiaryMeta | null = null;
    let entryId = '';
    let storedEntry: EntryData = {};
    let loadedEntry: EntryData | null = null;
    let entryIds: string[] = [];

    given(/^a diary "(.+)" is created$/, async (title: string) => {
      diary = await addDiary(title);
    });

    and(/^an entry with text "(.+)" is added to the diary$/, async (text: string) => {
      storedEntry = { text, mood: 'calm' };
      entryId = await addEntry(diary!.id, storedEntry);
    });

    when('the entry is loaded', async () => {
      loadedEntry = await loadEntry(entryId);
      entryIds = await loadEntryIds(diary!.id);
    });

    then('the loaded entry matches the added data', () => {
      expect(loadedEntry).toEqual(storedEntry);
    });

    and('the diary entry index includes the entry id', () => {
      expect(entryIds).toContain(entryId);
    });
  });

  test('modifying an entry updates stored data', ({ given, when, then }: StepDefinitions) => {
    let diary: DiaryMeta | null = null;
    let entryId = '';
    let updated: EntryData | null = null;

    given('a diary with an entry to modify exists', async () => {
      diary = await addDiary('Editable Diary');
      entryId = await addEntry(diary!.id, { text: 'Original', mood: 'neutral', tags: ['keep'] });
    });

    when(/^the entry is modified with new text "(.+)" and mood "(.+)"$/, async (text: string, mood: string) => {
      await modifyEntry<EntryData>(diary!.id, entryId, { text, mood });
      updated = await loadEntry<EntryData>(entryId);
    });

    then('the loaded entry contains the updated data and preserved fields', () => {
      expect(updated).not.toBeNull();
      expect(updated!.text).toBe('Updated text');
      expect(updated!.mood).toBe('happy');
      expect(updated!.tags).toEqual(['keep']);
    });
  });

  test('deleting an entry removes it and updates the index', ({ given, when, then, and }: StepDefinitions) => {
    let diary: DiaryMeta | null = null;
    let entryId = '';

    given('a diary with an entry to delete exists', async () => {
      diary = await addDiary('Diary to delete');
      entryId = await addEntry(diary!.id, { text: 'To remove' });
    });

    when('the entry is deleted', async () => {
      await deleteEntry(diary!.id, entryId);
    });

    then('the entry cannot be loaded', async () => {
      expect(await loadEntry(entryId)).toBeNull();
    });

    and('the diary entry index no longer includes the entry id', async () => {
      const ids = await loadEntryIds(diary!.id);
      expect(ids).not.toContain(entryId);
    });
  });

  test('moving an entry updates diary indices', ({ given, when, then, and }: StepDefinitions) => {
    let firstDiary: DiaryMeta | null = null;
    let secondDiary: DiaryMeta | null = null;
    let entryId = '';

    given('two diaries exist and one contains an entry', async () => {
      firstDiary = await addDiary('Source Diary');
      secondDiary = await addDiary('Destination Diary');
      entryId = await addEntry(firstDiary.id, { text: 'Movable entry' });
    });

    when('the entry is moved from the first diary to the second', async () => {
      await moveEntry(firstDiary!.id, secondDiary!.id, entryId);
    });

    then('the source diary index no longer lists the entry', async () => {
      const ids = await loadEntryIds(firstDiary!.id);
      expect(ids).not.toContain(entryId);
    });

    and('the destination diary index lists the entry', async () => {
      const ids = await loadEntryIds(secondDiary!.id);
      expect(ids).toContain(entryId);
    });
  });

  test('loading diaries fails on invalid stored data', ({ given, when, then }: StepDefinitions) => {
    let loadPromise: Promise<DiaryMeta[]> | null = null;

    given('storage contains invalid diaries data', async () => {
      await AsyncStorage.setItem('__encrypted_diaries__', '"invalid"');
    });

    when('diaries are loaded', () => {
      loadPromise = loadDiaries();
    });

    then(/^an error is thrown with message "(.+)"$/, async (message: string) => {
      await expect(loadPromise).rejects.toThrow(message);
    });
  });
};
