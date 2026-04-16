import { Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useSidebarInfo } from "../layout/SidebarInfoContext";
import {
  cellKey,
  PathfindingCancelledError,
  pathfindingAlgorithms,
  type Position,
} from "../pathfinding-algo";
import "./PathfinderPage.css";

const ROWS = 18;
const COLS = 32;
const DEFAULT_START: Position = { row: 8, col: 6 };
const DEFAULT_END: Position = { row: 8, col: 25 };
const VISIT_DELAY = 16;
const PATH_DELAY = 32;
const SIDEBAR_SOURCE = "pathfinder-page";

type ToolMode = "wall" | "start" | "end" | "erase";
type DragAction = "draw-wall" | "erase-wall" | "move-start" | "move-end";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default function PathfinderPage() {
  const { setSidebarInfo, clearSidebarInfo } = useSidebarInfo();
  const [algorithm, setAlgorithm] = useState("bfs");
  const [tool, setTool] = useState<ToolMode>("wall");
  const [start, setStart] = useState<Position>(DEFAULT_START);
  const [end, setEnd] = useState<Position>(DEFAULT_END);
  const [walls, setWalls] = useState<Set<string>>(new Set());
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [pathCells, setPathCells] = useState<Set<string>>(new Set());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [status, setStatus] = useState("Ready to explore");

  const pathRunIdRef = useRef(0);
  const dragActionRef = useRef<DragAction | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
      dragActionRef.current = null;
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const clearMarks = () => {
    setVisitedCells(new Set());
    setPathCells(new Set());
  };

  const cancelVisualization = (message?: string) => {
    pathRunIdRef.current += 1;
    setIsVisualizing(false);
    clearMarks();

    if (message) {
      setStatus(message);
    }
  };

  const updateCellByTool = (row: number, col: number, action: DragAction) => {
    const key = cellKey(row, col);
    const isStart = start.row === row && start.col === col;
    const isEnd = end.row === row && end.col === col;

    if (action === "draw-wall") {
      if (isStart || isEnd) {
        return;
      }

      setWalls((currentWalls) => {
        const nextWalls = new Set(currentWalls);
        nextWalls.add(key);
        return nextWalls;
      });
      return;
    }

    if (action === "erase-wall") {
      setWalls((currentWalls) => {
        const nextWalls = new Set(currentWalls);
        nextWalls.delete(key);
        return nextWalls;
      });
      return;
    }

    if (action === "move-start") {
      if (isEnd) {
        return;
      }

      setWalls((currentWalls) => {
        const nextWalls = new Set(currentWalls);
        nextWalls.delete(key);
        return nextWalls;
      });
      setStart({ row, col });
      return;
    }

    if (isStart) {
      return;
    }

    setWalls((currentWalls) => {
      const nextWalls = new Set(currentWalls);
      nextWalls.delete(key);
      return nextWalls;
    });
    setEnd({ row, col });
  };

  const handleCellMouseDown = (row: number, col: number) => {
    cancelVisualization("Board updated");
    setIsMouseDown(true);

    const key = cellKey(row, col);
    let action: DragAction;

    if (tool === "wall") {
      action = walls.has(key) ? "erase-wall" : "draw-wall";
    } else if (tool === "erase") {
      action = "erase-wall";
    } else if (tool === "start") {
      action = "move-start";
    } else {
      action = "move-end";
    }

    dragActionRef.current = action;
    updateCellByTool(row, col, action);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isMouseDown || !dragActionRef.current) {
      return;
    }

    updateCellByTool(row, col, dragActionRef.current);
  };

  const animateCells = async (
    positions: Position[],
    type: "visited" | "path",
    currentRunId: number
  ) => {
    for (const position of positions) {
      if (pathRunIdRef.current !== currentRunId) {
        throw new PathfindingCancelledError();
      }

      const key = cellKey(position.row, position.col);
      const isEndpoint =
        (position.row === start.row && position.col === start.col) ||
        (position.row === end.row && position.col === end.col);

      if (!isEndpoint) {
        if (type === "visited") {
          setVisitedCells((current) => {
            const next = new Set(current);
            next.add(key);
            return next;
          });
        } else {
          setPathCells((current) => {
            const next = new Set(current);
            next.add(key);
            return next;
          });
        }
      }

      await sleep(type === "visited" ? VISIT_DELAY : PATH_DELAY);
    }
  };

  const visualizePath = async () => {
    const currentRunId = pathRunIdRef.current + 1;
    pathRunIdRef.current = currentRunId;

    setIsVisualizing(true);
    clearMarks();
    setStatus("Searching...");

    const selectedAlgorithm = pathfindingAlgorithms[algorithm];

    try {
      const result = selectedAlgorithm.pathfind({
        rows: ROWS,
        cols: COLS,
        start,
        end,
        walls: new Set(walls),
        shouldCancel: () => pathRunIdRef.current !== currentRunId,
      });

      await animateCells(result.visitedOrder, "visited", currentRunId);

      if (result.path.length > 0) {
        await animateCells(result.path, "path", currentRunId);
        setStatus(`Path found in ${result.path.length - 1} steps`);
      } else {
        setStatus("No path found");
      }
    } catch (error) {
      if (!(error instanceof PathfindingCancelledError)) {
        throw error;
      }
    } finally {
      if (pathRunIdRef.current === currentRunId) {
        setIsVisualizing(false);
      }
    }
  };

  const clearPath = () => {
    cancelVisualization("Path cleared");
  };

  const clearBoard = () => {
    cancelVisualization("Board reset");
    setWalls(new Set());
    setStart(DEFAULT_START);
    setEnd(DEFAULT_END);
  };

  const algorithmDetails = pathfindingAlgorithms[algorithm];

  useEffect(() => {
    setSidebarInfo(SIDEBAR_SOURCE, "Pathfinding Details", [
      { label: "Algorithm", value: algorithmDetails.label },
      { label: "Grid", value: `${ROWS} x ${COLS}` },
      { label: "Time", value: algorithmDetails.timeComplexity },
      { label: "Space", value: algorithmDetails.spaceComplexity },
      { label: "Status", value: status },
    ]);

    return () => clearSidebarInfo(SIDEBAR_SOURCE);
  }, [
    algorithmDetails.label,
    algorithmDetails.spaceComplexity,
    algorithmDetails.timeComplexity,
    clearSidebarInfo,
    setSidebarInfo,
    status,
  ]);

  return (
    <div className="page-shell">
      <div className="page-toolbar">
        <div
          className="container d-flex align-items-center p-4"
          style={{ width: "100%", backgroundColor: "#434E78" }}
        >
          <div className="row w-100 g-3 align-items-center">
            <div className="col-lg-3 col-md-4">
              <Form.Select
                className="custom-select"
                value={algorithm}
                aria-label="Pathfinding algorithm select"
                onChange={(event) => {
                  cancelVisualization("Algorithm changed");
                  setAlgorithm(event.target.value);
                }}
              >
                {Object.entries(pathfindingAlgorithms).map(
                  ([value, definition]) => (
                    <option key={value} value={value}>
                      {definition.label}
                    </option>
                  )
                )}
              </Form.Select>
            </div>
            <div className="col-lg-2 col-md-3">
              <Form.Select
                className="custom-select"
                value={tool}
                aria-label="Grid tool select"
                onChange={(event) => setTool(event.target.value as ToolMode)}
              >
                <option value="wall">Wall Tool</option>
                <option value="start">Move Start</option>
                <option value="end">Move End</option>
                <option value="erase">Erase Tool</option>
              </Form.Select>
            </div>
            <div className="col-lg-2 col-md-2">
              <button
                className="btn activeColor fw-bold pathfinder-button"
                onClick={visualizePath}
              >
                {isVisualizing ? "Searching..." : "Visualize"}
              </button>
            </div>
            <div className="col-lg-2 col-md-2">
              <button
                className="btn btn-outline-light fw-bold pathfinder-button secondary-button"
                onClick={clearPath}
              >
                Clear Path
              </button>
            </div>
            <div className="col-lg-2 col-md-2">
              <button
                className="btn btn-outline-light fw-bold pathfinder-button secondary-button"
                onClick={clearBoard}
              >
                Clear Board
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="visualizer-wrapper">
        <div className="pathfinder-legend">
          <span>
            <i className="legend-swatch start-node" />
            Start
          </span>
          <span>
            <i className="legend-swatch end-node" />
            End
          </span>
          <span>
            <i className="legend-swatch wall-node" />
            Wall
          </span>
          <span>
            <i className="legend-swatch visited-node" />
            Visited
          </span>
          <span>
            <i className="legend-swatch path-node" />
            Path
          </span>
        </div>

        <div className="pathfinder-grid-shell">
          <div
            className="pathfinder-grid"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: ROWS }).map((_, row) =>
              Array.from({ length: COLS }).map((__, col) => {
                const key = cellKey(row, col);
                const isStart = start.row === row && start.col === col;
                const isEnd = end.row === row && end.col === col;
                const isWall = walls.has(key);
                const isPath = pathCells.has(key);
                const isVisited = visitedCells.has(key);

                let className = "grid-node";

                if (isStart) className += " start-node";
                else if (isEnd) className += " end-node";
                else if (isWall) className += " wall-node";
                else if (isPath) className += " path-node";
                else if (isVisited) className += " visited-node";

                return (
                  <button
                    key={key}
                    type="button"
                    className={className}
                    onMouseDown={() => handleCellMouseDown(row, col)}
                    onMouseEnter={() => handleCellMouseEnter(row, col)}
                    onMouseUp={() => {
                      setIsMouseDown(false);
                      dragActionRef.current = null;
                    }}
                    aria-label={`Grid node ${row},${col}`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
