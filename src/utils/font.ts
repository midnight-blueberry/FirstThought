export type IconSizeToken = {
  xsmall: number;
  small: number;
  medium: number;
  large: number;
  xlarge: number;
};

export const toFamilyKey = (name: string) =>
  name.replace(/-\d+(?:-italic)?$/, '').replace(/ /g, '_');

export function nextIconSize(level: number, sizes: IconSizeToken): IconSizeToken {
  const iconDelta = (level - 3) * 4;
  return {
    xsmall: sizes.xsmall + iconDelta,
    small: sizes.small + iconDelta,
    medium: sizes.medium + iconDelta,
    large: sizes.large + iconDelta,
    xlarge: sizes.xlarge + iconDelta,
  };
}
