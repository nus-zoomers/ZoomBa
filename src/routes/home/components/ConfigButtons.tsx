import React from 'react';

const ConfigButtons = () => {
  return (
    <div className="config-button-container">
      <div className="config-button">
        <button type="button" className="config-button-icon">
          Icon
        </button>
        Import
      </div>
      <div className="config-button">
        <button type="button" className="config-button-icon">
          Icon
        </button>
        Settings
      </div>
    </div>
  );
};

export default ConfigButtons;
