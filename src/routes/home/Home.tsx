/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { remote } from 'electron';

import { store } from '../../app/store';

import Script from './components/Script';
import ScriptButtons from './components/ScriptButtons';
import ThemeSelection, { Theme } from './components/ThemeSelection';
import FontSelection from './components/FontSelection';
import ScrollingSettings from './components/ScrollingSettings';
import TitleBar from '../../components/titleBar';

const { ipcRenderer } = window.require('electron');

const Home = () => {
  let fileReader: FileReader;

  const [script, setScript] = useState<string>('');
  const [scriptName, setScriptName] = useState<string>('');
  const [startPrompt, setStartPrompt] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [fontSize, setFontSize] = useState<number>(28);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(3.0);

  useEffect(() => {
    const { content, name, prompt } = store.get('script');
    setScript(content);
    setScriptName(name);
    setStartPrompt(prompt);
    const config = store.get('config');
    setTheme(config.theme);
    setFontSize(config.fontSize);
    setIsAutoScrolling(config.autoscroll);
    setSpeed(config.speed);
  }, []);

  useEffect(() => {
    ipcRenderer.on('show-mainwindow-from-main', () => {
      const window = remote.getCurrentWindow();
      remote.app.dock.show();
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

    try {
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file);
      setScriptName(file.name);
      new remote.Notification({
        title: 'Loaded Successfully',
        body: 'Your script file has been loaded.',
      }).show();
    } catch (e) {
      setScript(originalScript);
      setScriptName(originalScriptName);
      remote.dialog.showErrorBox(
        'Failed to Load Script',
        'Something went wrong when trying to load your script!'
      );
    }
  };

  const save = () => {
    store.set('script', {
      content: script,
      name: scriptName,
      prompt: startPrompt,
    });
    store.set('config', {
      theme,
      fontSize,
      autoscroll: isAutoScrolling,
      speed,
    });
  };

  const handleSave = () => {
    try {
      save();
      new remote.Notification({
        title: 'Saved Successfully',
        body:
          'You will see your script and settings the next time you launch the application.',
      }).show();
    } catch (e) {
      remote.dialog.showErrorBox(
        'Failed to Save',
        'Something went wrong when trying to save your script!'
      );
    }
  };

  const handleOpenTeleprompter = () => {
    if (script === '') {
      remote.dialog.showErrorBox(
        'Please have a script!',
        'You cannot begin with an empty script!'
      );
      return;
    }
    save();
    ipcRenderer.send('show-subwindow-to-main', '');
    const window = remote.getCurrentWindow();
    window.minimize();
  };

  return (
    <>
      <TitleBar />
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
          <ThemeSelection
            theme={theme}
            setTheme={setTheme}
            fontSize={fontSize}
          />
          <FontSelection fontSize={fontSize} setFontSize={setFontSize} />
          <ScrollingSettings
            startPrompt={startPrompt}
            setStartPrompt={setStartPrompt}
            isAutoScrolling={isAutoScrolling}
            setIsAutoScrolling={setIsAutoScrolling}
            speed={speed}
            setSpeed={setSpeed}
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
    </>
  );
};

export default Home;
