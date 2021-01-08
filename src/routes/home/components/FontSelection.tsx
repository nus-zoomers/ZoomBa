import React, { useState, useRef } from 'react';
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const FontSelection = () => {
  const [value, setValue] = React.useState(30);
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
