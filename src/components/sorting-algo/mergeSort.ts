import { activate, createSortingContext, finish, syncArray } from "./helpers";
import type { SortingAlgorithm } from "./types";

async function merge(
  context: ReturnType<typeof createSortingContext>,
  left: number,
  middle: number,
  right: number
) {
  const leftPart = context.array.slice(left, middle + 1);
  const rightPart = context.array.slice(middle + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftPart.length && j < rightPart.length) {
    await activate(context, [left + i, middle + 1 + j]);

    if (leftPart[i] <= rightPart[j]) {
      context.array[k] = leftPart[i];
      i += 1;
    } else {
      context.array[k] = rightPart[j];
      j += 1;
    }

    await syncArray(context, [k]);
    k += 1;
  }

  while (i < leftPart.length) {
    await activate(context, [left + i, k], false);
    context.array[k] = leftPart[i];
    i += 1;
    await syncArray(context, [k]);
    k += 1;
  }

  while (j < rightPart.length) {
    await activate(context, [middle + 1 + j, k], false);
    context.array[k] = rightPart[j];
    j += 1;
    await syncArray(context, [k]);
    k += 1;
  }
}

async function mergeSortRange(
  context: ReturnType<typeof createSortingContext>,
  left: number,
  right: number
) {
  if (left >= right) {
    return;
  }

  const middle = Math.floor((left + right) / 2);
  await mergeSortRange(context, left, middle);
  await mergeSortRange(context, middle + 1, right);
  await merge(context, left, middle, right);
}

export const mergeSort: SortingAlgorithm = async (
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

  if (context.array.length > 1) {
    await mergeSortRange(context, 0, context.array.length - 1);
  }

  finish(context);
};
