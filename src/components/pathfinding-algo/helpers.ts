import type { PathfindingParams, Position } from "./types";

export class PathfindingCancelledError extends Error {
  constructor() {
    super("Pathfinding run cancelled");
    this.name = "PathfindingCancelledError";
  }
}

export function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

export function samePosition(a: Position, b: Position) {
  return a.row === b.row && a.col === b.col;
}

export function assertNotCancelled(shouldCancel?: () => boolean) {
  if (shouldCancel?.()) {
    throw new PathfindingCancelledError();
  }
}

export function getNeighbors(
  row: number,
  col: number,
  { rows, cols, walls }: Pick<PathfindingParams, "rows" | "cols" | "walls">
) {
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  return directions
    .map(([rowDelta, colDelta]) => ({
      row: row + rowDelta,
      col: col + colDelta,
    }))
    .filter(
      ({ row: nextRow, col: nextCol }) =>
        nextRow >= 0 &&
        nextRow < rows &&
        nextCol >= 0 &&
        nextCol < cols &&
        !walls.has(cellKey(nextRow, nextCol))
    );
}

export function heuristic(a: Position, b: Position) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function reconstructPath(
  cameFrom: Map<string, string>,
  start: Position,
  end: Position
) {
  const startKey = cellKey(start.row, start.col);
  const endKey = cellKey(end.row, end.col);

  if (startKey !== endKey && !cameFrom.has(endKey)) {
    return [];
  }

  const path: Position[] = [];
  let currentKey: string | undefined = endKey;

  while (currentKey) {
    const [row, col] = currentKey.split("-").map(Number);
    path.unshift({ row, col });

    if (currentKey === startKey) {
      break;
    }

    currentKey = cameFrom.get(currentKey);
  }

  return path;
}
