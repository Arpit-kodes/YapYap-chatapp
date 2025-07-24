import React, { useState } from "react";

const defaultRooms = ["general", "tech", "gaming", "music"];

function RoomList({ onSelectRoom }) {
  const [room, setRoom] = useState("");
  const [customRooms, setCustomRooms] = useState([...defaultRooms]);

  const handleAddRoom = () => {
    const trimmed = room.trim();
    if (trimmed && !customRooms.includes(trimmed)) {
      setCustomRooms((prev) => [...prev, trimmed]);
      onSelectRoom(trimmed); // ✅ notify parent
      setRoom("");
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <h4>Select or Create Room</h4>
      <div>
        {customRooms.map((r, idx) => (
          <button
            key={idx}
            onClick={() => onSelectRoom(r)}
            style={{
              margin: "5px",
              padding: "5px 10px",
              backgroundColor: "#ddd",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Custom room name"
        />
        <button onClick={handleAddRoom} style={{ marginLeft: 5 }}>
          ➕ Add
        </button>
      </div>
    </div>
  );
}

export default RoomList;
