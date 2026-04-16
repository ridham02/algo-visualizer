import { activate, createSortingContext, finish, syncArray } from "./helpers";
import type { SortingAlgorithm } from "./types";

export const selectionSort: SortingAlgorithm = async (
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
  const sorted: number[] = [];

  for (let i = 0; i < array.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      await activate(context, [minIndex, j]);

      if (array[j] < array[minIndex]) {
        minIndex = j;
        await activate(context, [i, minIndex]);
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      await syncArray(context, [i, minIndex]);
    }

    sorted.push(i);
    context.setSorted([...sorted]);
  }

  finish(context);
};
