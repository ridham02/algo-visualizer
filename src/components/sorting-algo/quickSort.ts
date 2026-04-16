import { activate, createSortingContext, finish, syncArray } from "./helpers";
import type { SortingAlgorithm } from "./types";

async function partition(
  context: ReturnType<typeof createSortingContext>,
  low: number,
  high: number,
  settled: Set<number>
) {
  const pivot = context.array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    await activate(context, [j, high]);

    if (context.array[j] < pivot) {
      i += 1;

      if (i !== j) {
        [context.array[i], context.array[j]] = [context.array[j], context.array[i]];
        await syncArray(context, [i, j]);
      }
    }
  }

  [context.array[i + 1], context.array[high]] = [
    context.array[high],
    context.array[i + 1],
  ];
  await syncArray(context, [i + 1, high]);

  const pivotIndex = i + 1;
  settled.add(pivotIndex);
  context.setSorted([...settled].sort((a, b) => a - b));

  return pivotIndex;
}

async function quickSortRange(
  context: ReturnType<typeof createSortingContext>,
  low: number,
  high: number,
  settled: Set<number>
) {
  if (low > high) {
    return;
  }

  if (low === high) {
    settled.add(low);
    context.setSorted([...settled].sort((a, b) => a - b));
    return;
  }

  const pivotIndex = await partition(context, low, high, settled);
  await quickSortRange(context, low, pivotIndex - 1, settled);
  await quickSortRange(context, pivotIndex + 1, high, settled);
}

export const quickSort: SortingAlgorithm = async (
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
  const settled = new Set<number>();

  if (context.array.length > 1) {
    await quickSortRange(context, 0, context.array.length - 1, settled);
  }

  finish(context);
};
