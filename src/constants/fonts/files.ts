// src/constants/fonts/files.ts
// Реестр статических ttf-файлов. Пока только Comfortaa.
export const FONT_FILES = {
  Comfortaa: {
    300: require("@assets/fonts/Comfortaa/Comfortaa-300.ttf"),
    400: require("@assets/fonts/Comfortaa/Comfortaa-400.ttf"),
    500: require("@assets/fonts/Comfortaa/Comfortaa-500.ttf"),
    600: require("@assets/fonts/Comfortaa/Comfortaa-600.ttf"),
    700: require("@assets/fonts/Comfortaa/Comfortaa-700.ttf"),
  },
} as const;
