import React from 'react';

const Home = () => {
  return (
    <main id="main">
      <div className="script-container">
        <textarea
          className="script-textarea"
          placeholder="Paste your script here or import a file!"
          aria-placeholder="Paste your script here or import a file!"
        />
      </div>
      <div className="config-container">
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
