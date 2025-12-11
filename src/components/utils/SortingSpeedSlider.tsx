import { useState } from "react";
import "./SortingSpeedSlider.css";

interface Props {
  value: any;
  onChange: any;
}

export default function SortingSpeedSlider() {
  const [value, setValue] = useState(2);

  return (
    <div className="d-flex align-items-center w-100">
      <span className="text-white me-3">Speed:</span>

      <div className="flex-grow-1 d-flex flex-column">
        <div
          className="d-flex justify-content-between w-100 mb-1 px-1 text-white"
          style={{ fontSize: "12px" }}
        >
          <span>Slow</span>
          <span>Med</span>
          <span>Fast</span>
        </div>

        <input
          type="range"
          min={1}
          max={3}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="range-slider slider1"
        />
      </div>
    </div>
  );
}
