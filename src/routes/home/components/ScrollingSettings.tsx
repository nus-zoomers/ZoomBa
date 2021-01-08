import React, { useState } from 'react';
import { Switch } from '@material-ui/core';
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
      <div className="scrolling-settings-header">
        Auto Scrolling
        <Switch
          className="scrolling-settings-switch"
          checked={isAutoScrolling}
          onChange={(e: { target: { checked: boolean } }) =>
            handleCheckBox(e.target.checked)
          }
          name="auto scrolling"
          color="primary"
        />
      </div>
      <div className="scrolling-settings-description">
        {isAutoScrolling
          ? 'Auto Scrolling uses voice recognition to toggle your lines for you, giving you a worry-free presentation experience. Scrolling begins once the Starting Prompt is detected.'
          : 'Have fine grain control over how long each of your lines stay on the screen. Configure the duration by using the slider below.'}
      </div>
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
