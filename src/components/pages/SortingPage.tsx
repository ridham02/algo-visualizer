import { Form } from "react-bootstrap";
import Slider from "@mui/material/Slider";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useSidebarInfo } from "../layout/SidebarInfoContext";
import { generateArray } from "../../utils/generateArray";
import { sortingAlgorithms } from "../sorting-algo";
import { SortCancelledError } from "../sorting-algo/helpers";
import "./SortingPage.css";

const PrettoSlider = styled(Slider)({
  color: "#E97F4A",
  height: 5,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 11,
    background: "unset",
    padding: 0,
    width: 25,
    height: 25,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#E97F4A",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

const SIDEBAR_SOURCE = "sorting-page";

export default function SortingPage() {
  const { setSidebarInfo, clearSidebarInfo } = useSidebarInfo();
  const [arraySize, setArraySize] = useState<number>(5);
  const [algorithm, setAlgorithm] = useState<string>("bubble");
  const [array, setArray] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const sortRunIdRef = useRef(0);
  const [isSorting, setIsSorting] = useState(false);

  const cancelCurrentSort = () => {
    sortRunIdRef.current += 1;
    setIsSorting(false);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    cancelCurrentSort();
    setAlgorithm(e.target.value);
  };

  const changeArraySize = (_: Event, value: number | number[]) => {
    const newValue = value as number;
    cancelCurrentSort();
    setArraySize(newValue);
  };
  useEffect(() => {
    setArray(generateArray(arraySize));
  }, [arraySize]);

  const handleSort = async () => {
    if (!algorithm) return;

    const sortFn = sortingAlgorithms[algorithm]?.sort;

    if (!sortFn) return;

    const currentRunId = sortRunIdRef.current + 1;
    sortRunIdRef.current = currentRunId;
    setIsSorting(true);
    setActiveIndices([]);
    setSortedIndices([]);

    try {
      await sortFn(
        array,
        setArray,
        setActiveIndices,
        setSortedIndices,
        () => sortRunIdRef.current !== currentRunId
      );
    } catch (error) {
      if (!(error instanceof SortCancelledError)) {
        throw error;
      }
    } finally {
      if (sortRunIdRef.current === currentRunId) {
        setIsSorting(false);
      }
    }
  };

  const algorithmDetails = sortingAlgorithms[algorithm];

  useEffect(() => {
    if (!algorithmDetails) {
      return;
    }

    setSidebarInfo(SIDEBAR_SOURCE, "Sorting Details", [
      { label: "Algorithm", value: algorithmDetails.label },
      { label: "Array Size", value: String(arraySize) },
      { label: "Time", value: algorithmDetails.timeComplexity.worst },
      { label: "Space", value: algorithmDetails.spaceComplexity },
      { label: "Status", value: isSorting ? "Sorting..." : "Ready" },
    ]);

    return () => clearSidebarInfo(SIDEBAR_SOURCE);
  }, [
    algorithmDetails,
    arraySize,
    clearSidebarInfo,
    isSorting,
    setSidebarInfo,
  ]);

  return (
    <div className="page-shell">
      <div className="page-toolbar">
        <div
          className="container d-flex align-items-center p-4"
          style={{ width: "100%", backgroundColor: "#434E78" }}
        >
          <div className="row w-100">
            <div className="col-md-2 col-sm mx-3">
              <Form.Select
                className="custom-select"
                aria-label="Algorithm select"
                value={algorithm}
                onChange={handleChange}
              >
                {Object.entries(sortingAlgorithms).map(([value, definition]) => (
                  <option key={value} value={value}>
                    {definition.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div
              className="col-md-4 col-sm mx-3 d-flex align-items-center"
              style={{ color: "#ffff" }}
            >
              <span>Array Size</span>
              <PrettoSlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={5}
                min={5}
                max={100}
                onChange={changeArraySize}
              />
            </div>
            <div className="col-md-2 col-sm">
              <button className="btn activeColor fw-bold" onClick={handleSort}>
                {isSorting ? "Sorting..." : "Sort"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="visualizer-wrapper sorting-visualizer-wrapper">
        <div className="array-container">
          {array.map((value, idx) => {
            let barClass = "array-bar";

            if (activeIndices.includes(idx)) barClass += " active";
            if (sortedIndices.includes(idx)) barClass += " sorted";

            return (
              <div
                key={idx}
                className={barClass}
                style={{
                  height: `${value}px`,
                  width: `${100 / array.length}%`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
