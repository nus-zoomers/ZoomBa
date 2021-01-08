/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { remote } from 'electron';

import { store } from '../../app/store';

import Script from './components/Script';
import ScriptButtons from './components/ScriptButtons';
import ThemeSelection, { Theme } from './components/ThemeSelection';
import FontSelection from './components/FontSelection';
import StartingPrompt from './components/StartingPrompt';

const Home = () => {
  let fileReader: FileReader;

  const [script, setScript] = useState<string>('');
  const [scriptName, setScriptName] = useState<string>('');
  const [startPrompt, setStartPrompt] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [fontSize, setFontSize] = useState<number>(28);

  useEffect(() => {
    const { content, name, prompt } = store.get('script');
    setScript(content);
    setScriptName(name);
    setStartPrompt(prompt);
    const config = store.get('config');
    setTheme(config.theme);
    setFontSize(config.fontSize);
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
      store.set('config', {
        theme,
        fontSize,
      });
      notification = {
        title: 'Saved Successfully',
        body:
          'You will see your script and settings the next time you launch the application.',
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
        <ThemeSelection theme={theme} setTheme={setTheme} fontSize={fontSize} />
        <FontSelection fontSize={fontSize} setFontSize={setFontSize} />
        <StartingPrompt
          startPrompt={startPrompt}
          setStartPrompt={setStartPrompt}
        />
        <button type="button" className="config-start-button">
          Start
        </button>
      </div>
    </main>
  );
};

export default Home;
