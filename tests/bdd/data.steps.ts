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
  deleteDiary,
  loadDiaries,
  addEntry,
  loadEntry,
  deleteEntry,
  modifyEntry,
  moveEntry,
} from '@/scripts/data';
import { loadEntryIds } from '@/utils/storage';
import type { DiaryMeta } from '@/types/data';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type CoreStepDefinitions = Pick<StepDefinitions, 'given' | 'when' | 'then'>;

export default (test: JestCucumberTestFn) => {
  beforeEach(async () => {
    (AsyncStorage as unknown as { __storage: Map<string, string> }).__storage.clear();
    (SecureStore as unknown as { __store: Map<string, string> }).__store.clear();
    await SecureStore.setItemAsync('enc_key', 'dummy');
  });

  test('adding a diary saves it and it appears in the list', ({ given, when, then }: CoreStepDefinitions) => {
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

  test('adding an entry saves it, indexes it, and it can be loaded', ({
    given,
    when,
    then,
  }: CoreStepDefinitions) => {
    let diaryId = '';
    let entryId = '';
    let text = '';

    given(/^a diary "(.+)" is created$/, async (title: string) => {
      const diary = await addDiary(title);
      diaryId = diary.id;
    });

    when(/^an entry with text "(.+)" is added to the diary$/, async (entryText: string) => {
      text = entryText;
      entryId = await addEntry(diaryId, { text });
    });

    then('the saved entry can be loaded', async () => {
      const entry = await loadEntry(entryId);
      expect(entry).not.toBeNull();
      expect(entry!.text).toBe(text);
    });

    then('the diary entry index includes the entry id', async () => {
      const entryIds = await loadEntryIds(diaryId);
      expect(entryIds).toContain(entryId);
    });
  });

  test('modifying an entry updates stored data and preserves other fields', ({
    given,
    when,
    then,
  }: CoreStepDefinitions) => {
    let diaryId = '';
    let entryId = '';
    let cachedEntry: Awaited<ReturnType<typeof loadEntry>> = null;

    given(/^a diary "(.+)" is created$/, async (title: string) => {
      const diary = await addDiary(title);
      diaryId = diary.id;
    });

    when(
      /^an entry with text "(.+)" and mood "(.+)" is added to the diary$/,
      async (entryText: string, mood: string) => {
        entryId = await addEntry(diaryId, { text: entryText, mood });
      },
    );

    when(/^the entry text is changed to "(.+)"$/, async (newText: string) => {
      await modifyEntry(diaryId, entryId, { text: newText });
    });

    then(/^the loaded entry text is "(.+)"$/, async (expectedText: string) => {
      const entry = await loadEntry(entryId);
      cachedEntry = entry;
      expect(entry).not.toBeNull();
      expect(entry!.text).toBe(expectedText);
    });

    then(/^the loaded entry mood is "(.+)"$/, async (expectedMood: string) => {
      const entry = cachedEntry ?? (await loadEntry(entryId));
      expect(entry).not.toBeNull();
      expect(entry!.mood).toBe(expectedMood);
    });
  });

  test('deleting an entry removes it from storage and diary index', ({
    given,
    when,
    then,
  }: CoreStepDefinitions) => {
    let diaryId = '';
    let entryId = '';

    given(/^a diary "(.+)" is created$/, async (title: string) => {
      const diary = await addDiary(title);
      diaryId = diary.id;
    });

    when(/^an entry with text "(.+)" is added to the diary$/, async (entryText: string) => {
      entryId = await addEntry(diaryId, { text: entryText });
    });

    when('the entry is deleted from the diary', async () => {
      await deleteEntry(diaryId, entryId);
    });

    then('the entry record is removed from storage', async () => {
      expect(await AsyncStorage.getItem(`record_${entryId}`)).toBeNull();
    });

    then('the diary entry index does not include the entry id', async () => {
      const entryIds = await loadEntryIds(diaryId);
      expect(entryIds).not.toContain(entryId);
    });

    then('the entry cannot be loaded', async () => {
      const entry = await loadEntry(entryId);
      expect(entry).toBeNull();
    });
  });

  test('deleting a diary removes the diary and related entries', ({ given, when, then }: CoreStepDefinitions) => {
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

  test('moving an entry between diaries updates indices', ({ given, when, then }: CoreStepDefinitions) => {
    let firstDiaryId = '';
    let secondDiaryId = '';
    let entryId = '';
    let entryText = '';

    given(/^diaries "(.+)" and "(.+)" are created$/, async (firstTitle: string, secondTitle: string) => {
      const diaryA = await addDiary(firstTitle);
      const diaryB = await addDiary(secondTitle);
      firstDiaryId = diaryA.id;
      secondDiaryId = diaryB.id;
    });

    given(/^an entry with text "(.+)" is added to the first diary$/, async (text: string) => {
      entryText = text;
      entryId = await addEntry(firstDiaryId, { text });
    });

    when('the entry is moved to the second diary', async () => {
      await moveEntry(firstDiaryId, secondDiaryId, entryId);
    });

    then('the first diary index does not include the entry id', async () => {
      const firstDiaryIds = await loadEntryIds(firstDiaryId);
      expect(firstDiaryIds).not.toContain(entryId);
    });

    then('the second diary index includes the entry id', async () => {
      const secondDiaryIds = await loadEntryIds(secondDiaryId);
      expect(secondDiaryIds).toContain(entryId);
    });

    then('the saved entry data can still be loaded', async () => {
      const entry = await loadEntry(entryId);
      expect(entry).not.toBeNull();
      expect(entry!.text).toBe(entryText);
    });
  });
};
