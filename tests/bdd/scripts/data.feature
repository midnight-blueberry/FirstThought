Feature: Работа со скриптами данных

  Scenario: addDiary добавляет новый дневник
    Given очищены AsyncStorage и SecureStore и записан ключ шифрования
    When я создаю дневник "My Diary"
    Then список дневников имеет длину 1 и заголовок первого равен "My Diary"

  Scenario: deleteDiary удаляет дневник и связанные записи
    Given очищены AsyncStorage и SecureStore и записан ключ шифрования
    When я создаю дневник "Diary" и добавляю запись "hello", затем удаляю этот дневник
    Then список дневников пуст, `record_<entryId>` и `__enc_entry_ids_<diaryId>` в AsyncStorage отсутствуют
