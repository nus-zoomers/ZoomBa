import React from 'react';

const StartingPrompt = () => {
  return (
    <>
      <h2 className="config-starting-label">Starting Prompt</h2>
      <textarea
        className="config-starting-textarea"
        placeholder="Enter your starting prompt here!"
        aria-placeholder="Enter your starting prompt here!"
        rows={3}
      />
    </>
  );
};

export default StartingPrompt;
