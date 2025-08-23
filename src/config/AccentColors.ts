export const accentColors = [
  { name: 'Красный', hex: '#E57373' },
  { name: 'Оранжевый', hex: '#FFB74D' },
  { name: 'Желтый', hex: '#FFCD00' },
  { name: 'Зеленый', hex: '#81C784' },
  { name: 'Синий', hex: '#64B5F6' },
  { name: 'Фиолетовый', hex: '#BA68C8' },
] as const;

export const defaultAccentColor = accentColors[2].hex;
