const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ✅ Models
const Message = require("./models/Message");

// ✅ In-Memory State
const users = {}; // socket.id => { username, room }
const rooms = new Set(["general", "tech", "random"]); // Initial public rooms

// ✅ Utility: Get all users in a room
const getUsersInRoom = (room) =>
  Object.values(users)
    .filter((user) => user.room === room)
    .map((user) => user.username);

// ✅ Utility: Create private room name
const getPrivateRoom = (u1, u2) => [u1, u2].sort().join("_");

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Update to frontend domain in production
    methods: ["GET", "POST"],
  },
});

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 New socket connected:", socket.id);

  // Initial room list
  socket.emit("roomListUpdate", Array.from(rooms));

  // Create public room
  socket.on("createRoom", (roomName) => {
    const trimmed = roomName.trim();
    if (trimmed && !rooms.has(trimmed)) {
      rooms.add(trimmed);
      io.emit("roomListUpdate", Array.from(rooms)); // Broadcast to all
    }
  });

  // Join a room (public or private)
  socket.on("joinRoom", async ({ username, room }) => {
    if (!username || !room) return;

    // Leave all previous rooms
    for (const r of socket.rooms) {
      if (r !== socket.id) socket.leave(r);
    }

    // Join new room and track user
    socket.join(room);
    users[socket.id] = { username, room };

    // Send system join message only in public rooms
    if (!room.includes("_")) {
      socket.to(room).emit("chatMessage", {
        sender: "System",
        text: `${username} joined the room`,
        timestamp: new Date(),
      });
    }

    io.to(room).emit("onlineUsers", getUsersInRoom(room));

    // Send chat history
    try {
      const history = await Message.find({ room }).sort({ timestamp: 1 }).limit(50);
      socket.emit("chatHistory", history);
    } catch (err) {
      console.error("❌ Chat history error:", err.message);
    }
  });

  // Handle chat messages
  socket.on("chatMessage", async ({ message, room, sender, to }) => {
    if (!message || !room || !sender) return;

    const msg = {
      sender,
      room,
      text: message,
      to: to || null,
      timestamp: new Date(),
    };

    try {
      await Message.create(msg);
      io.to(room).emit("chatMessage", msg);
    } catch (err) {
      console.error("❌ Message save error:", err.message);
    }
  });

  // Typing indicator
  socket.on("typing", ({ room, username }) => {
    if (room && username) {
      socket.to(room).emit("typing", username);
    }
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      const { room, username } = user;

      if (!room.includes("_")) {
        socket.to(room).emit("chatMessage", {
          sender: "System",
          text: `${username} left the room`,
          timestamp: new Date(),
        });
      }

      delete users[socket.id];
      io.to(room).emit("onlineUsers", getUsersInRoom(room));
    }

    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Deploy fix: Use only process.env.PORT
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on Render at port ${PORT}`);
});
