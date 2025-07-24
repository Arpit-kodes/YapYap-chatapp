// src/components/TypingIndicator.jsx
import React from "react";

const TypingIndicator = ({ typingUser }) => {
  if (!typingUser) return null;

  return (
    <p className="italic text-sm text-gray-500 mt-1">
      {typingUser} is typing...
    </p>
  );
};

export default TypingIndicator;
