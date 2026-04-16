export type Position = {
  row: number;
  col: number;
};

export type PathfindingAlgorithmKey =
  | "bfs"
  | "dfs"
  | "dijkstra"
  | "astar"
  | "greedy";

export type PathfindingParams = {
  rows: number;
  cols: number;
  start: Position;
  end: Position;
  walls: Set<string>;
  shouldCancel?: () => boolean;
};

export type PathfindingResult = {
  visitedOrder: Position[];
  path: Position[];
};

export type PathfindingAlgorithm = (
  params: PathfindingParams
) => PathfindingResult;

export type PathfindingAlgorithmDefinition = {
  label: string;
  pathfind: PathfindingAlgorithm;
  timeComplexity: string;
  spaceComplexity: string;
};
