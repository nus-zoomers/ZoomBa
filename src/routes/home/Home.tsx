import React from 'react';

import Script from './components/Script';
import ConfigButtons from './components/ConfigButtons';
import ConfigDisplay from './components/ConfigDisplay';
import StartingPrompt from './components/StartingPrompt';

const Home = () => {
  return (
    <main id="main">
      <div className="script-container">
        <Script />
      </div>
      <div className="config-container">
        <ConfigButtons />
        <ConfigDisplay />
        <StartingPrompt />
        <button type="button" className="config-start-button">
          START
        </button>
      </div>
    </main>
  );
};

export default Home;
