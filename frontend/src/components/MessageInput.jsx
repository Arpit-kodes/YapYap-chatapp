import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #444",
          backgroundColor: "#1e3a5c",
          color: "#f0f4f8",
        }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: "#3273dc",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
