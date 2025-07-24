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
    <div style={{ padding: 30, maxWidth: 400, margin: "0 auto" }}>
      <h2>💬 Welcome to YapYap Chat</h2>

      <div style={{ marginTop: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={isGuest}
            onChange={() => {
              setIsGuest(!isGuest);
              setPassword("");
            }}
          />{" "}
          Continue as Guest
        </label>
      </div>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", padding: 8, marginTop: 10 }}
      />

      {!isGuest && (
        <input
          type="password"
          placeholder={isSignup ? "Create password" : "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 10 }}
        />
      )}

      <RoomList onSelectRoom={setSelectedRoom} />

      {selectedRoom && (
        <div style={{ marginTop: 10 }}>
          ✅ <strong>Selected Room:</strong> <span>{selectedRoom}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          width: "100%",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        {isGuest ? "Enter as Guest" : isSignup ? "Sign Up" : "Login"}
      </button>

      {!isGuest && (
        <p style={{ marginTop: 15 }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
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

export default Home;
