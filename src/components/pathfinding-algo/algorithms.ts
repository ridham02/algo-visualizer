import {
  assertNotCancelled,
  cellKey,
  getNeighbors,
  heuristic,
  reconstructPath,
  samePosition,
} from "./helpers";
import type {
  PathfindingAlgorithm,
  PathfindingAlgorithmDefinition,
  Position,
} from "./types";

function bfsSearch({
  rows,
  cols,
  start,
  end,
  walls,
  shouldCancel,
}: Parameters<PathfindingAlgorithm>[0]) {
  const queue: Position[] = [start];
  const visited = new Set<string>([cellKey(start.row, start.col)]);
  const cameFrom = new Map<string, string>();
  const visitedOrder: Position[] = [];

  while (queue.length > 0) {
    assertNotCancelled(shouldCancel);
    const current = queue.shift()!;
    visitedOrder.push(current);

    if (samePosition(current, end)) {
      break;
    }

    for (const neighbor of getNeighbors(current.row, current.col, {
      rows,
      cols,
      walls,
    })) {
      const neighborKey = cellKey(neighbor.row, neighbor.col);

      if (visited.has(neighborKey)) {
        continue;
      }

      visited.add(neighborKey);
      cameFrom.set(neighborKey, cellKey(current.row, current.col));
      queue.push(neighbor);
    }
  }

  return { visitedOrder, path: reconstructPath(cameFrom, start, end) };
}

function dfsSearch({
  rows,
  cols,
  start,
  end,
  walls,
  shouldCancel,
}: Parameters<PathfindingAlgorithm>[0]) {
  const stack: Position[] = [start];
  const visited = new Set<string>();
  const cameFrom = new Map<string, string>();
  const visitedOrder: Position[] = [];

  while (stack.length > 0) {
    assertNotCancelled(shouldCancel);
    const current = stack.pop()!;
    const currentKey = cellKey(current.row, current.col);

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    visitedOrder.push(current);

    if (samePosition(current, end)) {
      break;
    }

    const neighbors = getNeighbors(current.row, current.col, {
      rows,
      cols,
      walls,
    }).reverse();

    for (const neighbor of neighbors) {
      const neighborKey = cellKey(neighbor.row, neighbor.col);

      if (visited.has(neighborKey)) {
        continue;
      }

      if (!cameFrom.has(neighborKey)) {
        cameFrom.set(neighborKey, currentKey);
      }

      stack.push(neighbor);
    }
  }

  return { visitedOrder, path: reconstructPath(cameFrom, start, end) };
}

function dijkstraSearch({
  rows,
  cols,
  start,
  end,
  walls,
  shouldCancel,
}: Parameters<PathfindingAlgorithm>[0]) {
  const distances = new Map<string, number>();
  const cameFrom = new Map<string, string>();
  const visited = new Set<string>();
  const visitedOrder: Position[] = [];
  const queue = [{ position: start, priority: 0 }];
  const startKey = cellKey(start.row, start.col);

  distances.set(startKey, 0);

  while (queue.length > 0) {
    assertNotCancelled(shouldCancel);
    queue.sort((a, b) => a.priority - b.priority);
    const current = queue.shift()!.position;
    const currentKey = cellKey(current.row, current.col);

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    visitedOrder.push(current);

    if (samePosition(current, end)) {
      break;
    }

    for (const neighbor of getNeighbors(current.row, current.col, {
      rows,
      cols,
      walls,
    })) {
      const neighborKey = cellKey(neighbor.row, neighbor.col);
      const nextDistance = (distances.get(currentKey) ?? Infinity) + 1;

      if (nextDistance < (distances.get(neighborKey) ?? Infinity)) {
        distances.set(neighborKey, nextDistance);
        cameFrom.set(neighborKey, currentKey);
        queue.push({ position: neighbor, priority: nextDistance });
      }
    }
  }

  return { visitedOrder, path: reconstructPath(cameFrom, start, end) };
}

function aStarSearch({
  rows,
  cols,
  start,
  end,
  walls,
  shouldCancel,
}: Parameters<PathfindingAlgorithm>[0]) {
  const startKey = cellKey(start.row, start.col);
  const gScore = new Map<string, number>([[startKey, 0]]);
  const cameFrom = new Map<string, string>();
  const visited = new Set<string>();
  const visitedOrder: Position[] = [];
  const openSet = [{ position: start, priority: heuristic(start, end) }];

  while (openSet.length > 0) {
    assertNotCancelled(shouldCancel);
    openSet.sort((a, b) => a.priority - b.priority);
    const current = openSet.shift()!.position;
    const currentKey = cellKey(current.row, current.col);

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    visitedOrder.push(current);

    if (samePosition(current, end)) {
      break;
    }

    for (const neighbor of getNeighbors(current.row, current.col, {
      rows,
      cols,
      walls,
    })) {
      const neighborKey = cellKey(neighbor.row, neighbor.col);
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        openSet.push({
          position: neighbor,
          priority: tentativeG + heuristic(neighbor, end),
        });
      }
    }
  }

  return { visitedOrder, path: reconstructPath(cameFrom, start, end) };
}

function greedyBestFirstSearch({
  rows,
  cols,
  start,
  end,
  walls,
  shouldCancel,
}: Parameters<PathfindingAlgorithm>[0]) {
  const cameFrom = new Map<string, string>();
  const visited = new Set<string>();
  const visitedOrder: Position[] = [];
  const openSet = [{ position: start, priority: heuristic(start, end) }];

  while (openSet.length > 0) {
    assertNotCancelled(shouldCancel);
    openSet.sort((a, b) => a.priority - b.priority);
    const current = openSet.shift()!.position;
    const currentKey = cellKey(current.row, current.col);

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    visitedOrder.push(current);

    if (samePosition(current, end)) {
      break;
    }

    for (const neighbor of getNeighbors(current.row, current.col, {
      rows,
      cols,
      walls,
    })) {
      const neighborKey = cellKey(neighbor.row, neighbor.col);

      if (visited.has(neighborKey)) {
        continue;
      }

      if (!cameFrom.has(neighborKey)) {
        cameFrom.set(neighborKey, currentKey);
      }

      openSet.push({
        position: neighbor,
        priority: heuristic(neighbor, end),
      });
    }
  }

  return { visitedOrder, path: reconstructPath(cameFrom, start, end) };
}

export const pathfindingAlgorithms: Record<
  string,
  PathfindingAlgorithmDefinition
> = {
  bfs: {
    label: "Breadth-First Search",
    pathfind: bfsSearch,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
  },
  dfs: {
    label: "Depth-First Search",
    pathfind: dfsSearch,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
  },
  dijkstra: {
    label: "Dijkstra's Algorithm",
    pathfind: dijkstraSearch,
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
  },
  astar: {
    label: "A* Search",
    pathfind: aStarSearch,
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
  },
  greedy: {
    label: "Greedy Best-First Search",
    pathfind: greedyBestFirstSearch,
    timeComplexity: "O(V log V)",
    spaceComplexity: "O(V)",
  },
};
