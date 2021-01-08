/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

const Home = () => {
  let fileReader: FileReader;

  const [script, setScript] = useState('Please enter your script here.');

  const handleTextChange = (e) => {
    setScript(e.value);
  };

  const handleFileRead = () => {
    const content = fileReader.result;
    setScript(content);
  };

  const handleFileChosen = (file: Blob) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <main id="main">
      <div className="script-container">
        <textarea
          className="script-textarea"
          placeholder={script}
          aria-placeholder={script}
          rows={30}
          cols={50}
          value={script}
          onChange={(e) => handleTextChange(e)}
        />
      </div>
      <div className="config-container">
        <div className="config-button-container">
          <div className="config-button">
            <input
              type="file"
              id="script-upload"
              accept="text/*"
              onChange={(e) => handleFileChosen(e.target.files[0])}
            />
            <button type="button" className="config-button-icon">
              <label htmlFor="script-upload" id="script-upload-label">
                Icon
              </label>
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
        <div className="config-display">
          <p>Font Size: XXX</p>
          <p>Font Color: XXX</p>
          <p>Other configs: XXX</p>
        </div>
        <h2 className="config-starting-label">Starting Prompt</h2>
        <textarea
          className="config-starting-textarea"
          placeholder="Enter your starting prompt here!"
          aria-placeholder="Enter your starting prompt here!"
          rows={3}
        />
        <button type="button" className="config-start-button">
          START
        </button>
      </div>
    </main>
  );
};

export default Home;
