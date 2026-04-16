import { activate, createSortingContext, finish, syncArray } from "./helpers";
import type { SortingAlgorithm } from "./types";

export const insertionSort: SortingAlgorithm = async (
  input,
  updateArray,
  setActive,
  setSorted,
  shouldCancel
) => {
  const context = createSortingContext(
    input,
    updateArray,
    setActive,
    setSorted,
    shouldCancel
  );
  const { array } = context;

  if (array.length <= 1) {
    finish(context);
    return;
  }

  context.setSorted([0]);

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    await activate(context, [i]);

    while (j >= 0) {
      await activate(context, [j, j + 1]);

      if (array[j] <= key) {
        break;
      }

      array[j + 1] = array[j];
      await syncArray(context, [j, j + 1]);
      j -= 1;
    }

    array[j + 1] = key;
    await syncArray(context, [j + 1]);
    context.setSorted(Array.from({ length: i + 1 }, (_, index) => index));
  }

  finish(context);
};
