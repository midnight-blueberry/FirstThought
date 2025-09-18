Feature: Sticky scroll

  Scenario: Сохраняет смещение прокрутки после смены темы
    Given отрендерен список со scrollRef
    And зафиксирован press по "theme:dark" с измерениями y=190 и h=20
    And текущая прокрутка равна 150
    When элемент "theme:dark" после применения измеряется как y=210 и h=20
    And я применяю изменения со StickySelection
    Then scrollTo был вызван с y=170 и animated=false
