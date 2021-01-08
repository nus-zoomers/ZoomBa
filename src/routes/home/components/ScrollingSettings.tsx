import React, { useState, useRef } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ScrollSpeedSelection from './ScrollSpeedSelection';
import StartingPrompt from './StartingPrompt';

interface ScrollingSettingsProps {
  startPrompt: string;
  setStartPrompt: (name: string) => void;
}

const ScrollingSettings: React.FC<ScrollingSettingsProps> = (
  props: ScrollingSettingsProps
) => {
  const { startPrompt, setStartPrompt } = props;
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);

  const handleCheckBox = (checked: boolean) => {
    setIsAutoScrolling(checked);
  };

  return (
    <div className="scrolling-settings">
      Auto Scrolling
      <Checkbox
        className="config-auto-scrolling"
        checked={isAutoScrolling}
        onChange={(e: { target: { checked: boolean } }) =>
          handleCheckBox(e.target.checked)
        }
        name="auto scrolling"
        color="primary"
      />
      {isAutoScrolling ? (
        <StartingPrompt
          startPrompt={startPrompt}
          setStartPrompt={setStartPrompt}
        />
      ) : (
        <ScrollSpeedSelection />
      )}
    </div>
  );
};

export default ScrollingSettings;
