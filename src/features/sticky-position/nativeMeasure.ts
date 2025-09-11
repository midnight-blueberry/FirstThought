import { UIManager, type ScrollView } from 'react-native';

export function measureInWindowByHandle(
  handle: number,
): Promise<{ x: number; y: number; width: number; height: number }> {
  return new Promise((resolve) => {
    UIManager.measure(
      handle,
      (_x, _y, width, height, pageX, pageY) => {
        resolve({ x: pageX, y: pageY, width, height });
      },
    );
  });
}

export function measureViewportOfScrollView(
  scrollView: ScrollView,
): Promise<{ topWin: number; height: number }> {
  return new Promise((resolve) => {
    (scrollView as any).measureInWindow(
      (_x: number, y: number, _w: number, h: number) => {
        resolve({ topWin: y, height: h });
      },
    );
  });
}
