import React from 'react';

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

interface ThemeSelectionProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: number;
}

const ThemeSelection: React.FC<ThemeSelectionProps> = (
  props: ThemeSelectionProps
) => {
  const { theme, setTheme, fontSize } = props;
  const secondLineFontSize = fontSize * 0.6;

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
          onClick={() => setTheme(Theme.LIGHT)}
        >
          <span className="first-line is-light" style={{ fontSize }}>
            This is the first line
          </span>
          <br />
          <span
            className="second-line is-light"
            style={{ fontSize: secondLineFontSize }}
          >
            This is the second line
          </span>
        </button>
        <button
          type="button"
          className={`config-theme-option${
            theme === Theme.DARK ? ' is-selected' : ''
          }`}
          onClick={() => setTheme(Theme.DARK)}
        >
          <span className="first-line is-dark" style={{ fontSize }}>
            This is the first line
          </span>
          <br />
          <span
            className="second-line is-dark"
            style={{ fontSize: secondLineFontSize }}
          >
            This is the second line
          </span>
        </button>
      </div>
    </>
  );
};

export default ThemeSelection;
