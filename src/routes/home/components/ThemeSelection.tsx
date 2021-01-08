import React, { useState } from 'react';
import lightThemeImage from '../assets/theme_light.png';
import darkThemeImage from '../assets/theme_dark.png';

const ThemeSelection = () => {
  const [theme, setTheme] = useState('Light');

  const handleSelectTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <>
      <h2 className="config-label" style={{ marginTop: 0 }}>
        Theme
      </h2>
      <div className="config-theme-selection">
        <button
          type="button"
          className={
            theme === 'Light'
              ? 'config-theme-option-active'
              : 'config-theme-option'
          }
          onClick={() => handleSelectTheme('Light')}
        >
          <img src={lightThemeImage} alt="light theme" />
        </button>
        <button
          type="button"
          className={
            theme === 'Dark'
              ? 'config-theme-option-active'
              : 'config-theme-option'
          }
          onClick={() => handleSelectTheme('Dark')}
        >
          <img src={darkThemeImage} alt="dark theme" />
        </button>
      </div>
    </>
  );
};

export default ThemeSelection;
