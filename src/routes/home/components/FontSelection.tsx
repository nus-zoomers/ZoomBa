import React from 'react';
import Slider from '@material-ui/core/Slider';
import TextFieldsIcon from '@material-ui/icons/TextFields';

interface FontSelectionProps {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
}

const FontSelection: React.FC<FontSelectionProps> = (
  props: FontSelectionProps
) => {
  const { fontSize, setFontSize } = props;
  const handleChange = (
    _: React.ChangeEvent<unknown>,
    newValue: number | number[]
  ) => {
    setFontSize(newValue as number);
  };

  return (
    <>
      <h2 className="config-label" style={{ marginTop: 0 }}>
        Font
      </h2>
      <div className="config-font-selection">
        <TextFieldsIcon fontSize="small" />
        <Slider
          className="config-font-slider"
          defaultValue={10}
          value={fontSize}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={2}
          min={20}
          max={32}
          onChange={handleChange}
        />
        <TextFieldsIcon fontSize="large" />
      </div>
    </>
  );
};

export default FontSelection;
