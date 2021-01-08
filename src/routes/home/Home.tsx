/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

import Script from './components/Script';
import ConfigButtons from './components/ConfigButtons';
import ThemeSelection from './components/ThemeSelection';
import StartingPrompt from './components/StartingPrompt';

const Home = () => {
  let fileReader: FileReader;

  const [script, setScript] = useState<string>('');

  const handleFileRead = () => {
    if (!fileReader) {
      return;
    }
    const content = fileReader.result;
    setScript(content as string);
  };

  const handleFileChosen = (file: Blob | null) => {
    if (!file) return;
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <main id="main">
      <div className="script-container">
        <ConfigButtons handleFileChosen={handleFileChosen} />
        <Script script={script} handleScriptChange={setScript} />
      </div>
      <div className="config-container">
        <ThemeSelection />
        <StartingPrompt />
        <button type="button" className="config-start-button">
          Start
        </button>
      </div>
    </main>
  );
};

export default Home;
