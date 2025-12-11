import { useState } from "react";
import "./ArraySizeSlider.css";


function ArraySizeSlider() {
    const [value, setValue] = useState(50);
  const getBubblePosition = () => {
    return {
      left: `${((value - 5) / (200 - 5)) * 100}%`
    };
  };

  return (
    <div className="d-flex flex-row align-items-center ">
      <span className="text-white" >
        Array Size:
      </span>

      <div className="range-wrapper">
        <div className="bubble" style={getBubblePosition()}>
          {value}
        </div>

        <input
          type="range"
          min="5"
          max="200"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="range-slider"
        />
      </div>
    </div>
  );
}

export default ArraySizeSlider;
