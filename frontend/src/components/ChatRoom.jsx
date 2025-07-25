import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import MessageInput from "./MessageInput";
import OnlineUsersList from "./OnlineUsersList";
import TypingIndicator from "./TypingIndicator";
import DirectChatList from "./DirectChatList"; // 👈 New

function ChatRoom() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [directUser, setDirectUser] = useState(null); // 👈 For private chat
  const chatRef = useRef(null);

  const getPrivateRoom = (u1, u2) => {
    return [u1, u2].sort().join("_"); // consistent room name
  };

  // ✅ Load user and join room
  useEffect(() => {
    const storedUser =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      window.location.href = "/";
      return;
    }

    const { username, room } = storedUser;
    setUsername(username);
    setRoom(room);
    socket.emit("joinRoom", { username, room });
  }, []);

  // ✅ Handle socket events
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

  // ✅ Scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const targetRoom = directUser ? getPrivateRoom(username, directUser) : room;
    socket.emit("chatMessage", {
      message,
      room: targetRoom,
      sender: username,
      to: directUser || null,
    });
  };

  const handleTyping = () => {
    const targetRoom = directUser ? getPrivateRoom(username, directUser) : room;
    socket.emit("typing", { room: targetRoom, username });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleDirectUser = (user) => {
    setDirectUser(user);
    const privateRoom = getPrivateRoom(username, user);
    setRoom(privateRoom); // update UI label
    socket.emit("joinRoom", { username, room: privateRoom });
    setMessages([]); // clear old public messages
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div>
          <h2 style={{ color: "#28266A", marginBottom: 5 }}>
            {directUser ? `💌 Chat with: ${directUser}` : `Room: ${room}`}
          </h2>
          <p
            style={{
              fontSize: 14,
              color: onlineUsers.length === 1 ? "#00b894" : "#ccc",
            }}
          >
            👥 {onlineUsers.length} user{onlineUsers.length !== 1 ? "s" : ""} online
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#d9534f",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <OnlineUsersList users={onlineUsers} />
      <DirectChatList
        users={onlineUsers}
        currentUser={username}
        onSelectUser={handleDirectUser}
      />

      <div
        ref={chatRef}
        style={{
          height: "300px",
          overflowY: "auto",
          backgroundColor: "#162d4d",
          padding: "10px",
          borderRadius: "8px",
          marginTop: "10px",
          color: "#f0f4f8",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <strong>{msg.sender}</strong>: {msg.text}
          </div>
        ))}
      </div>

      {typingUser && <TypingIndicator typingUser={typingUser} />}

      <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
    </div>
  );
}

export default ChatRoom;
