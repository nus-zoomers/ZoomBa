import React, { useRef } from 'react';

interface ConfigButtonProps {
  handleFileChosen: (file: Blob | null) => void;
}

const ConfigButtons: React.FC<ConfigButtonProps> = (
  props: ConfigButtonProps
) => {
  const { handleFileChosen } = props;
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (inputFileRef && inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <div className="config-button-container">
      <div className="config-button">
        <input
          type="file"
          id="script-upload"
          ref={inputFileRef}
          accept="text/*"
          onChange={(e) =>
            handleFileChosen(e.target.files ? e.target.files[0] : null)
          }
        />
        <button
          type="button"
          className="config-button-icon"
          onClick={handleButtonClick}
        >
          <i className="fas fa-file-upload" />
        </button>
        Import
      </div>
      <div className="config-button">
        <button type="button" className="config-button-icon">
          <i className="fas fa-cog" />
        </button>
        Settings
      </div>
    </div>
  );
};

export default ConfigButtons;
