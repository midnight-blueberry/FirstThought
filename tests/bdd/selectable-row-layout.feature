Feature: Layout of selectable row
  Scenario: Галочка выровнена по вертикальному центру
    Given компонент SelectableRow отрисован
    Then контейнер галочки имеет top 0 и bottom 0

  Scenario: Высота текста стабильна без указания fontSize
    Given компонент SelectableRow отрисован без fontSize
    Then строка лейбла имеет lineHeight равный размеру шрифта плюс отступ
