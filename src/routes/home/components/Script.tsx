import React from 'react';

interface ScriptProps {
  script: string;
  handleScriptChange: (newScript: string) => void;
}

const Script: React.FC<ScriptProps> = (props: ScriptProps) => {
  const { script, handleScriptChange } = props;

  return (
    <textarea
      className="script-textarea"
      placeholder="Paste your script here or import a file!"
      aria-placeholder="Paste your script here or import a file!"
      value={script}
      onChange={(e) => handleScriptChange(e.target.value)}
    />
  );
};

export default Script;
