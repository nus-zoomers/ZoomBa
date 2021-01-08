/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { remote } from 'electron';

import { store } from '../../app/store';

import Script from './components/Script';
import ScriptButtons from './components/ScriptButtons';
import ThemeSelection from './components/ThemeSelection';
import StartingPrompt from './components/StartingPrompt';

const { ipcRenderer } = window.require('electron');

const Home = () => {
  let fileReader: FileReader;

  const [script, setScript] = useState<string>('');
  const [scriptName, setScriptName] = useState<string>('');
  const [startPrompt, setStartPrompt] = useState<string>('');

  useEffect(() => {
    const { content, name, prompt } = store.get('script');
    setScript(content);
    setScriptName(name);
    setStartPrompt(prompt);
    ipcRenderer.on('show-mainwindow-from-main', () => {
      const window = remote.getCurrentWindow();
      window.show();
    });
  }, []);

  const handleFileRead = () => {
    if (!fileReader) {
      return;
    }
    const content = fileReader.result;

    setScript(content as string);
  };

  const handleUpload = (file: File | null) => {
    if (!file) return;
    const originalScript = script;
    const originalScriptName = scriptName;
    let notification;

    try {
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file);
      setScriptName(file.name);
      notification = {
        title: 'Loaded Successfully',
        body: 'Your script file has been loaded.',
      };
    } catch (e) {
      setScript(originalScript);
      setScriptName(originalScriptName);
      notification = {
        title: 'Failed to Load Script',
        body: 'Something went wrong when trying to load your script!',
      };
    } finally {
      new remote.Notification(notification).show();
    }
  };

  const handleSave = () => {
    let notification;
    try {
      store.set('script', {
        content: script,
        name: scriptName,
        prompt: startPrompt,
      });
      notification = {
        title: 'Saved Successfully',
        body:
          'You will see your script the next time you launch the application.',
      };
    } catch (e) {
      notification = {
        title: 'Failed to Save',
        body: 'Something went wrong when trying to save your script!',
      };
    } finally {
      new remote.Notification(notification).show();
    }
  };

  const handleOpenTeleprompter = () => {
    ipcRenderer.send('show-subwindow-to-main', 'ping');
    const window = remote.getCurrentWindow();
    window.minimize();
  };

  return (
    <main id="main">
      <div className="script-container">
        <ScriptButtons
          handleUpload={handleUpload}
          handleSave={handleSave}
          scriptName={scriptName}
          setScriptName={setScriptName}
        />
        <Script script={script} handleScriptChange={setScript} />
      </div>
      <div className="config-container">
        <ThemeSelection />
        <StartingPrompt
          startPrompt={startPrompt}
          setStartPrompt={setStartPrompt}
        />
        <button
          type="button"
          className="config-start-button"
          onClick={handleOpenTeleprompter}
        >
          Start
        </button>
      </div>
    </main>
  );
};

export default Home;
