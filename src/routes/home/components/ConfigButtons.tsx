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
    <div className="script-button-container">
      <div className="script-button">
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
          className="script-button-icon"
          onClick={handleButtonClick}
        >
          <i className="fas fa-file-upload" />
        </button>
      </div>
      <div className="script-input">
        <input
          className="script-input-field"
          placeholder="Enter script title here"
        />
      </div>
    </div>
  );
};

export default ConfigButtons;
