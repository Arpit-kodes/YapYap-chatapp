import React from "react";

const OnlineUsersList = ({ users }) => {
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#162d4d",
        border: "1px solid #2c3e50",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        marginBottom: "20px",
        textAlign: "left",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px", color: "#f0f4f8" }}>
        👥 Online Users
      </h3>
      <ul style={{ listStyle: "none", paddingLeft: "10px", margin: 0 }}>
        {users.map((user, index) => (
          <li key={index} style={{ color: "#00ff88", marginBottom: "4px" }}>
            • {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsersList;
