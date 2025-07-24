import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import MessageInput from "./MessageInput";
import OnlineUsersList from "./OnlineUsersList";
import TypingIndicator from "./TypingIndicator";

function ChatRoom() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      window.location.href = "/";
      return;
    }

    const { username, room } = storedUser;
    setUsername(username);
    setRoom(room);

    socket.emit("joinRoom", { username, room });
  }, []);

  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("chatHistory", (history) => {
      setMessages(history); // ✅ Load chat history
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
      socket.off("chatHistory");
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {room}</h2>
      <OnlineUsersList users={onlineUsers} />
      <div
        style={{
          height: 300,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender}</strong>: {msg.text}
          </div>
        ))}
      </div>
      {typingUser && <TypingIndicator typingUser={typingUser} />}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
}

export default ChatRoom;
