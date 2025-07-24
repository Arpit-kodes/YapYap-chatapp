// frontend/src/pages/Home.jsx
import React, { useState } from "react";
import RoomList from "../components/RoomList";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (!username || !selectedRoom) return alert("Please enter name & select room");
    localStorage.setItem("user", JSON.stringify({ username, room: selectedRoom }));
    navigate("/chat");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to YapYap Chat</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name"
        style={{ marginBottom: 10 }}
      />

      <RoomList onSelectRoom={setSelectedRoom} />

      <button onClick={handleStartChat} style={{ marginTop: 10 }}>Enter Chat</button>
    </div>
  );
};

export default Home;