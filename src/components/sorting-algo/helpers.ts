import { getDelay } from "../../utils/getDelay";
import type {
  SortingAlgorithm,
  UpdateArray,
  UpdateIndices,
} from "./types";

export type SortingContext = {
  array: number[];
  delay: number;
  updateArray: UpdateArray;
  setActive: UpdateIndices;
  setSorted: UpdateIndices;
  shouldCancel: () => boolean;
};

export class SortCancelledError extends Error {
  constructor() {
    super("Sort run cancelled");
    this.name = "SortCancelledError";
  }
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function createSortingContext(
  input: number[],
  updateArray: UpdateArray,
  setActive: UpdateIndices,
  setSorted: UpdateIndices,
  shouldCancel: () => boolean = () => false
): SortingContext {
  const guard = () => {
    if (shouldCancel()) {
      throw new SortCancelledError();
    }
  };

  return {
    array: [...input],
    delay: getDelay(input.length),
    updateArray: (array) => {
      guard();
      updateArray(array);
    },
    setActive: (indices) => {
      guard();
      setActive(indices);
    },
    setSorted: (indices) => {
      guard();
      setSorted(indices);
    },
    shouldCancel,
  };
}

export async function activate(
  context: SortingContext,
  indices: number[],
  pause = true
) {
  context.setActive(indices);

  if (pause) {
    await sleep(context.delay);
    if (context.shouldCancel()) {
      throw new SortCancelledError();
    }
  }
}

export async function syncArray(
  context: SortingContext,
  indices: number[] = [],
  pause = true
) {
  context.setActive(indices);
  context.updateArray([...context.array]);

  if (pause) {
    await sleep(context.delay);
    if (context.shouldCancel()) {
      throw new SortCancelledError();
    }
  }
}

export function finish(context: SortingContext) {
  context.setActive([]);
  context.setSorted(Array.from({ length: context.array.length }, (_, i) => i));
}

export type SortingAlgorithmDefinition = {
  label: string;
  sort: SortingAlgorithm;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
};
