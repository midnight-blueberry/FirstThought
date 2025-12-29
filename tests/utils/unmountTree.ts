// @ts-ignore
import { act } from 'react-test-renderer';

export async function unmountTree(tree: any): Promise<null> {
  if (tree) {
    await act(async () => {
      tree.unmount();
    });
  }

  return null;
}
