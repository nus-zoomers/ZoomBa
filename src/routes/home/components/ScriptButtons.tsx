import React, { useRef } from 'react';

interface ScriptButtonProps {
  handleUpload: (file: File | null) => void;
  handleSave: () => void;
  scriptName: string;
  setScriptName: (name: string) => void;
}

const ScriptButtons: React.FC<ScriptButtonProps> = (
  props: ScriptButtonProps
) => {
  const { handleUpload, handleSave, scriptName, setScriptName } = props;
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (inputFileRef && inputFileRef.current) {
      inputFileRef.current.click();
    }
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('start-stream');
  };

  return (
    <div className="script-button-container">
      <div className="script-input">
        <input
          className="script-input-field"
          placeholder="Enter script title here"
          value={scriptName}
          onChange={(e) => setScriptName(e.target.value)}
        />
      </div>
      <div className="script-button">
        <input
          type="file"
          id="script-upload"
          ref={inputFileRef}
          accept="text/*"
          onChange={(e) =>
            handleUpload(e.target.files ? e.target.files[0] : null)
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
      <div className="script-button">
        <button
          type="button"
          className="script-button-icon"
          onClick={handleSave}
        >
          <i className="fas fa-save" />
        </button>
      </div>
    </div>
  );
};

export default ScriptButtons;
