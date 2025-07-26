import React, { useEffect, useState } from "react";
import { socket } from "../socket"; // make sure this is the shared socket instance

function RoomList({ onSelectRoom }) {
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState("");

  useEffect(() => {
    //  Listen for room updates from server
    socket.on("roomListUpdate", (updatedRooms) => {
      setRooms(updatedRooms);
    });

    //  Request current room list on component mount
    socket.emit("requestRoomList");

    return () => {
      socket.off("roomListUpdate");
    };
  }, []);

  const handleAddRoom = () => {
    const trimmed = room.trim().toLowerCase();
    if (trimmed && !rooms.includes(trimmed)) {
      socket.emit("createRoom", trimmed); //  Notify server to create room
      setRoom("");
      setActiveRoom(trimmed);
      onSelectRoom(trimmed);
    }
  };

  const handleRoomSelect = (r) => {
    setActiveRoom(r);
    onSelectRoom(r);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ marginBottom: 10 }}>💬 Choose a Room</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {rooms.map((r, idx) => (
          <button
            key={idx}
            onClick={() => handleRoomSelect(r)}
            style={{
              padding: "8px 14px",
              backgroundColor: r === activeRoom ? "#3273dc" : "#1e3a5c",
              color: r === activeRoom ? "#fff" : "#f0f4f8",
              border: "1px solid #2c3e50",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 15 }}>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="New room name"
          style={{
            padding: "8px",
            backgroundColor: "#1e3a5c",
            color: "#f0f4f8",
            border: "1px solid #2c3e50",
            borderRadius: "5px",
            width: "70%",
          }}
        />
        <button
          onClick={handleAddRoom}
          style={{
            padding: "8px 12px",
            marginLeft: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Add
        </button>
      </div>
    </div>
  );
}

export default RoomList;
