import React, { useState } from 'react';

enum Theme {
  LIGHT,
  DARK,
}

const ThemeSelection = () => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  const handleSelectTheme = (newTheme: Theme) => {
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
          className={`config-theme-option${
            theme === Theme.LIGHT ? ' is-selected' : ''
          }`}
          onClick={() => handleSelectTheme(Theme.LIGHT)}
        >
          Hello
        </button>
        <button
          type="button"
          className={`config-theme-option${
            theme === Theme.DARK ? ' is-selected' : ''
          }`}
          onClick={() => handleSelectTheme(Theme.DARK)}
        >
          Goodbye
        </button>
      </div>
    </>
  );
};

export default ThemeSelection;
