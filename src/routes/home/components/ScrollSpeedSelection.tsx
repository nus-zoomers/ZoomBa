import React, { useState } from 'react';
import Slider from '@material-ui/core/Slider';

const ScrollSpeedSelection = () => {
  const [speed, setSpeed] = useState(1.5);

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
  };

  return (
    <>
      <h2 className="config-label">Scroll Speed</h2>

      <div className="config-scrolling-speed">
        Slow
        <Slider
          className="config-font-slider"
          defaultValue={1.5}
          value={speed}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
          step={0.1}
          min={0.5}
          max={3}
          onChange={handleSpeedChange}
        />
        Fast
      </div>
    </>
  );
};

export default ScrollSpeedSelection;
