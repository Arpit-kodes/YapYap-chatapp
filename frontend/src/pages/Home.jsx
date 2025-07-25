import React, { useState } from "react";
import RoomList from "../components/RoomList";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !selectedRoom) {
      return alert("Please enter name and select a room.");
    }

    if (!isGuest && !password) {
      return alert("Please enter a password for login/signup.");
    }

    try {
      let userData;

      if (isGuest) {
        userData = { username, room: selectedRoom, guest: true };
      } else if (isSignup) {
        const res = await axios.post("http://localhost:5000/api/auth/signup", {
          username,
          password,
        });
        userData = { ...res.data.user, room: selectedRoom, guest: false };
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
        });
        userData = { ...res.data.user, room: selectedRoom, guest: false };
      }

      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/chat");
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0b1f3a",
        color: "#f0f4f8",
        padding: 30,
        maxWidth: 450,
        margin: "40px auto",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>💬 YapYap Chat</h2>

      <label style={{ display: "block", marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={isGuest}
          onChange={() => {
            setIsGuest(!isGuest);
            setPassword("");
          }}
        />{" "}
        <span style={{ marginLeft: 6 }}>Continue as Guest</span>
      </label>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
      />

      {!isGuest && (
        <input
          type="password"
          placeholder={isSignup ? "Create password" : "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
      )}

      <RoomList onSelectRoom={setSelectedRoom} />

      {selectedRoom && (
        <div style={{ marginTop: 10 }}>
          ✅ <strong>Selected Room:</strong>{" "}
          <span style={{ color: "#00d8ff" }}>{selectedRoom}</span>
        </div>
      )}

      <button onClick={handleSubmit} style={buttonStyle}>
        {isGuest ? "Enter as Guest" : isSignup ? "Sign Up" : "Login"}
      </button>

      {!isGuest && (
        <p style={{ marginTop: 20, textAlign: "center" }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            style={{
              background: "none",
              border: "none",
              color: "#00d8ff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      )}
    </div>
  );
};

// 🔵 Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #2a3f5f",
  backgroundColor: "#162c4d",
  color: "#fff",
};

const buttonStyle = {
  marginTop: 20,
  padding: "12px",
  width: "100%",
  backgroundColor: "#0077ff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.2s ease",
};

export default Home;
