import { bubbleSort } from "./bubbleSort";
import { heapSort } from "./heapSort";
import { insertionSort } from "./insertionSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";
import { selectionSort } from "./selectionSort";
import type { SortingAlgorithmDefinition } from "./helpers";

export const sortingAlgorithms: Record<string, SortingAlgorithmDefinition> = {
  bubble: {
    label: "Bubble Sort",
    sort: bubbleSort,
    timeComplexity: {
      best: "O(n)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
    spaceComplexity: "O(1)",
  },
  insertion: {
    label: "Insertion Sort",
    sort: insertionSort,
    timeComplexity: {
      best: "O(n)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
    spaceComplexity: "O(1)",
  },
  merge: {
    label: "Merge Sort",
    sort: mergeSort,
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    spaceComplexity: "O(n)",
  },
  quick: {
    label: "Quick Sort",
    sort: quickSort,
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n^2)",
    },
    spaceComplexity: "O(log n)",
  },
  selection: {
    label: "Selection Sort",
    sort: selectionSort,
    timeComplexity: {
      best: "O(n^2)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
    spaceComplexity: "O(1)",
  },
  heap: {
    label: "Heap Sort",
    sort: heapSort,
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    spaceComplexity: "O(1)",
  },
};
