import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import ChatRoom from "./components/ChatRoom";
import MessageInput from "./components/MessageInput";
import OnlineUsersList from "./components/OnlineUsersList";
import TypingIndicator from "./components/TypingIndicator";

function App() {
  const [room, setRoom] = useState("general");
  const [username, setUsername] = useState("");
  const [inputName, setInputName] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (username) {
      socket.emit("joinRoom", { username, room });
    }
  }, [username, room]);

  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(null), 2000);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("onlineUsers");
      socket.off("typing");
    };
  }, []);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    socket.emit("chatMessage", { message, room, sender: username });
  };

  const handleTyping = () => {
    socket.emit("typing", { room, username });
  };

  const handleJoin = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return alert("Please enter a name.");
    setUsername(trimmed);
  };

  if (!username) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter your name to join as Guest</h2>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleJoin();
          }}
          placeholder="Your Name"
        />
        <button onClick={handleJoin} style={{ marginLeft: "10px" }}>
          Join
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {room}</h2>
      <OnlineUsersList users={onlineUsers} />
      <ChatRoom messages={messages} />
      {typingUser && <TypingIndicator typingUser={typingUser} />}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
}

export default App;
