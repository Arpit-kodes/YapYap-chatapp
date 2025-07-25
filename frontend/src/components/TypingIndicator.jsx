import React from "react";

const TypingIndicator = ({ typingUser }) => {
  if (!typingUser) return null;

  return (
    <p className="typing-indicator">
      {typingUser} is typing...
    </p>
  );
};

export default TypingIndicator;
