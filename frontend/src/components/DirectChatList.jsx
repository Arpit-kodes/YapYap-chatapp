// src/components/DirectChatList.jsx
import React from "react";

const DirectChatList = ({ users, currentUser, onSelectUser }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <h4 className="text-lg font-semibold mb-2">📬 Direct Message</h4>
      <ul>
        {users
          .filter((u) => u !== currentUser)
          .map((u, idx) => (
            <li
              key={idx}
              onClick={() => onSelectUser(u)}
              style={{
                cursor: "pointer",
                padding: "8px",
                backgroundColor: "#1e3a5c",
                marginBottom: "5px",
                borderRadius: "5px",
                color: "#fff",
              }}
            >
              💌 {u}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DirectChatList;
