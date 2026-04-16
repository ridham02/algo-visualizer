import { activate, createSortingContext, finish, syncArray } from "./helpers";
import type { SortingAlgorithm } from "./types";

async function heapify(
  context: ReturnType<typeof createSortingContext>,
  heapSize: number,
  rootIndex: number
) {
  let largest = rootIndex;
  const leftChild = 2 * rootIndex + 1;
  const rightChild = 2 * rootIndex + 2;

  if (leftChild < heapSize) {
    await activate(context, [rootIndex, leftChild]);

    if (context.array[leftChild] > context.array[largest]) {
      largest = leftChild;
    }
  }

  if (rightChild < heapSize) {
    await activate(context, [largest, rightChild]);

    if (context.array[rightChild] > context.array[largest]) {
      largest = rightChild;
    }
  }

  if (largest !== rootIndex) {
    [context.array[rootIndex], context.array[largest]] = [
      context.array[largest],
      context.array[rootIndex],
    ];
    await syncArray(context, [rootIndex, largest]);
    await heapify(context, heapSize, largest);
  }
}

export const heapSort: SortingAlgorithm = async (
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
  const sorted: number[] = [];

  for (let i = Math.floor(context.array.length / 2) - 1; i >= 0; i--) {
    await heapify(context, context.array.length, i);
  }

  for (let end = context.array.length - 1; end > 0; end--) {
    [context.array[0], context.array[end]] = [context.array[end], context.array[0]];
    await syncArray(context, [0, end]);
    sorted.unshift(end);
    context.setSorted([...sorted]);
    await heapify(context, end, 0);
  }

  if (context.array.length > 0) {
    context.setSorted(Array.from({ length: context.array.length }, (_, i) => i));
  }

  finish(context);
};
