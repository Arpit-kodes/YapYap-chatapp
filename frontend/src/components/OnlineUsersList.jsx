// src/components/OnlineUsersList.jsx
import React from "react";

const OnlineUsersList = ({ users }) => {
  return (
    <div className="p-2 bg-gray-100 border rounded shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-2">Online Users</h3>
      <ul className="space-y-1">
        {users.map((user, index) => (
          <li key={index} className="text-green-600">
            • {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsersList;
