import { activate, createSortingContext, finish, syncArray } from "./helpers";
import type { SortingAlgorithm } from "./types";

export const bubbleSort: SortingAlgorithm = async (
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
  const n = array.length;

  const sorted: number[] = [];

  for (let i = 0; i < n; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      await activate(context, [j, j + 1]);

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        await syncArray(context, [j, j + 1]);
        swapped = true;
      }
    }

    sorted.push(n - i - 1);
    context.setSorted([...sorted]);

    if (!swapped) break;
  }

  finish(context);
};
