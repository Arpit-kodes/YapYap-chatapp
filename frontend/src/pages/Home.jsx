import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleGuest = () => {
    if (!username.trim()) return alert("Enter a guest name");
    navigate("/lobby", { state: { username, isGuest: true } });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to YapYap Chat</h1>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/login")}>Login / Register</button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <input
          type="text"
          placeholder="Enter guest name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleGuest} style={{ marginLeft: "1rem" }}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default Home;
