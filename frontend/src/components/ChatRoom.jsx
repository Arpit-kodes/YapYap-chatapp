// src/components/ChatRoom.jsx
import React from "react";

const ChatRoom = ({ messages }) => {
  return (
    <div className="p-4 border rounded h-96 overflow-y-auto bg-white shadow-md">
      {messages.map((msg, index) => (
        <div key={index} className="mb-2">
          <strong className="text-blue-600">{msg.user}:</strong>{" "}
          <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatRoom;
