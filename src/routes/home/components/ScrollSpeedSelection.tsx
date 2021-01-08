import React from 'react';
import Slider from '@material-ui/core/Slider';

interface SpeedSelectionProps {
  speed: number;
  setSpeed: (speed: number) => void;
}

const ScrollSpeedSelection: React.FC<SpeedSelectionProps> = (
  props: SpeedSelectionProps
) => {
  const { speed, setSpeed } = props;

  const handleSpeedChange = (
    _: React.ChangeEvent<unknown>,
    newValue: number | number[]
  ) => {
    setSpeed(newValue as number);
  };

  return (
    <>
      <h2 className="config-label">Line Duration</h2>
      <div className="config-speed-slider-container">
        Fast
        <Slider
          className="config-speed-slider"
          value={speed}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
          step={0.5}
          min={1}
          max={10}
          onChange={handleSpeedChange}
          valueLabelFormat={(value) => `${value}s`}
        />
        Slow
      </div>
    </>
  );
};

export default ScrollSpeedSelection;
