import React from 'react';

interface StartingPromptProps {
  startPrompt: string;
  setStartPrompt: (prompt: string) => void;
}

const StartingPrompt: React.FC<StartingPromptProps> = (
  props: StartingPromptProps
) => {
  const { startPrompt, setStartPrompt } = props;

  return (
    <>
      <h2 className="config-label">Starting Prompt</h2>
      <div className="config-starting-prompt">
        <textarea
          className="config-starting-textarea"
          placeholder="Enter your starting prompt here!"
          aria-placeholder="Enter your starting prompt here!"
          value={startPrompt}
          onChange={(e) => setStartPrompt(e.target.value)}
          rows={2}
        />
      </div>
    </>
  );
};

export default StartingPrompt;
