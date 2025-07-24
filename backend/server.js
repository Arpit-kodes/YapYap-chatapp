const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Change to frontend domain in production
    methods: ["GET", "POST"]
  },
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

const users = {}; // { socket.id: { username, room } }

// ✅ Socket.io Events
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    if (!username || !room) return;

    socket.join(room);
    users[socket.id] = { username, room };

    socket.to(room).emit("chatMessage", {
      sender: "System",
      text: `${username} joined the room`,
    });

    io.to(room).emit("onlineUsers", getUsersInRoom(room));
  });

  socket.on("chatMessage", ({ message, room, sender }) => {
    if (!message || !room || !sender) return;

    io.to(room).emit("chatMessage", {
      text: message,
      sender,
      timestamp: new Date(),
    });

    // 💾 Save message to MongoDB (implement Message model if needed)
  });

  socket.on("typing", ({ room, username }) => {
    if (room && username) {
      socket.to(room).emit("typing", username);
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit("chatMessage", {
        sender: "System",
        text: `${user.username} left the room`,
      });

      delete users[socket.id];
      io.to(user.room).emit("onlineUsers", getUsersInRoom(user.room));
    }

    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Helper: Get all usernames in room
function getUsersInRoom(room) {
  return Object.values(users)
    .filter((user) => user.room === room)
    .map((user) => user.username);
}

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
