import { useRef, useCallback, useContext, createContext } from 'react';
import { ScrollView, View, findNodeHandle, UIManager } from 'react-native';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';

export type AnchorSetter = (ref: View | number | null) => void;

export const AnchorContext = createContext<AnchorSetter>(() => {});

function measureAsync(target: any, relativeTo: any): Promise<number | null> {
  return new Promise((resolve) => {
    const targetHandle = findNodeHandle(target);
    const relativeHandle = findNodeHandle(relativeTo);
    if (targetHandle == null || relativeHandle == null) {
      resolve(null);
      return;
    }
    UIManager.measureLayout(
      targetHandle,
      relativeHandle,
      () => resolve(null),
      (_x, y) => resolve(y),
    );
  });
}

export default function useAnchorStableScroll() {
  const overlay = useOverlayTransition();
  const state = useRef<{
    anchor: any;
    oldAnchorY: number;
    scrollY: number;
    inProgress: boolean;
  }>({ anchor: null, oldAnchorY: 0, scrollY: 0, inProgress: false });

  const setAnchor = useCallback<AnchorSetter>((ref) => {
    state.current.anchor = ref;
  }, []);

  const captureBeforeUpdate = useCallback(async (scrollRef: ScrollView | null) => {
    if (state.current.inProgress) return;
    const anchor = state.current.anchor;
    if (!anchor || !scrollRef) return;
    // get inner content view
    const inner = (scrollRef as any).getInnerViewNode?.();
    if (!inner) return;
    const anchorY = await measureAsync(anchor, inner);
    const offsetY = await measureAsync(inner, scrollRef);
    if (anchorY == null || offsetY == null) return;
    state.current.oldAnchorY = anchorY;
    state.current.scrollY = -offsetY;
    state.current.inProgress = true;
  }, []);

  const adjustAfterLayout = useCallback(async (scrollRef: ScrollView | null) => {
    const { anchor, inProgress, oldAnchorY, scrollY } = state.current;
    if (!inProgress || !anchor || !scrollRef) return;
    const inner = (scrollRef as any).getInnerViewNode?.();
    if (!inner) {
      state.current.inProgress = false;
      return;
    }
    const newAnchorY = await measureAsync(anchor, inner);
    if (newAnchorY == null) {
      state.current.inProgress = false;
      return;
    }
    const perform = () => {
      scrollRef.scrollTo({ y: scrollY + (newAnchorY - oldAnchorY), animated: false });
      state.current.anchor = null;
      state.current.oldAnchorY = 0;
      state.current.scrollY = 0;
      state.current.inProgress = false;
    };
    const getOpacity = overlay?.getOpacity;
    if (getOpacity && getOpacity() < 1) {
      const start = Date.now();
      const check = () => {
        if (getOpacity() >= 1 || Date.now() - start > 300) {
          perform();
        } else {
          requestAnimationFrame(check);
        }
      };
      requestAnimationFrame(check);
    } else {
      perform();
    }
  }, [overlay]);

  return { setAnchor, captureBeforeUpdate, adjustAfterLayout };
}

export const useAnchorSetter = () => useContext(AnchorContext);
