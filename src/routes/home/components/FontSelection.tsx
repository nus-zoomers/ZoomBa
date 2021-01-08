import React from 'react';
import Slider from '@material-ui/core/Slider';

const FontSelection = () => {
  const [value, setValue] = React.useState(30);
  const handleChange = (
    _: React.ChangeEvent<unknown>,
    newValue: number | number[]
  ) => {
    setValue(newValue as number);
  };

  return (
    <>
      <h2 className="config-label" style={{ marginTop: 0 }}>
        Font
      </h2>
      <div className="config-font-selection">
        <span style={{ fontSize: value }}>Hello world!</span>
        <Slider
          className="config-font-slider"
          defaultValue={30}
          value={value}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          min={15}
          max={30}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default FontSelection;
