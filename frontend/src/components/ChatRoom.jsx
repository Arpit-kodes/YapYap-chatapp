import React, { useEffect, useState, useRef } from "react";
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

  const chatRef = useRef(null);

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
      setMessages(history);
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

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    socket.emit("chatMessage", { message, room, sender: username });
  };

  const handleTyping = () => {
    socket.emit("typing", { room, username });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "#f0f4f8" }}>Room: {room}</h2>
      <OnlineUsersList users={onlineUsers} />
      <div
        ref={chatRef}
        style={{
          height: "300px",
          overflowY: "auto",
          backgroundColor: "#162d4d",
          padding: "10px",
          borderRadius: "8px",
          marginTop: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "8px", color: "#f0f4f8" }}>
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
