import { accentColors, defaultAccentColor } from '@/constants/AccentColors';

describe('AccentColors constants', () => {
  it('В массиве находится 6 уникальных элементов', () => {
    expect(accentColors).toHaveLength(6);

    const names = new Set<string>();
    const hexes = new Set<string>();

    accentColors.forEach((color) => {
      expect(names.has(color.name)).toBe(false);
      expect(hexes.has(color.hex)).toBe(false);

      names.add(color.name);
      hexes.add(color.hex);
    });
  });

  it('Каждый элемент массива имеет свойства name и hex правильного типа и формата содержимого', () => {
    accentColors.forEach((color) => {
      expect(typeof color.name).toBe('string');
      expect(typeof color.hex).toBe('string');
      expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('В массиве есть все ожидаемые названия цветов', () => {
    const expectedColors = ['Красный', 'Оранжевый', 'Желтый', 'Зеленый', 'Синий', 'Фиолетовый'];
    
    expectedColors.forEach(color => {
      expect(accentColors.find(element => element.name === color)).toBeTruthy();
    });
  });

  it('defaultAccentColor соответствует цвету с названием "Желтый"', () => {
    const def = accentColors.find(c => c.hex === defaultAccentColor);
    expect(def).toBeDefined();
    expect(def!.name).toBe('Желтый');
  });
});

