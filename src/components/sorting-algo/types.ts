export type UpdateArray = (array: number[]) => void;
export type UpdateIndices = (indices: number[]) => void;

export type SortingAlgorithm = (
  array: number[],
  updateArray: UpdateArray,
  setActive: UpdateIndices,
  setSorted: UpdateIndices,
  shouldCancel?: () => boolean
) => Promise<void>;
