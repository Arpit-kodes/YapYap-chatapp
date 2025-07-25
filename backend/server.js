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

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*", // 🔒 Replace with frontend URL in production
    methods: ["GET", "POST"],
  },
});

// ✅ Active Users: socket.id -> { username, room }
const users = {};

// ✅ Helper: Get all users in a room
const getUsersInRoom = (room) =>
  Object.values(users)
    .filter((user) => user.room === room)
    .map((user) => user.username);

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 New socket connected:", socket.id);

  // 🔄 Join Room
  socket.on("joinRoom", async ({ username, room }) => {
    if (!username || !room) return;

    // ✅ Remove socket from previous rooms (except personal)
    for (const r of socket.rooms) {
      if (r !== socket.id) socket.leave(r);
    }

    // ✅ Track and join new room
    socket.join(room);
    users[socket.id] = { username, room };

    // ✅ Notify room
    socket.to(room).emit("chatMessage", {
      sender: "System",
      text: `${username} joined the room`,
      timestamp: new Date(),
    });

    // ✅ Update online users
    io.to(room).emit("onlineUsers", getUsersInRoom(room));

    // ✅ Send chat history
    try {
      const history = await Message.find({ room }).sort({ timestamp: 1 }).limit(50);
      socket.emit("chatHistory", history);
    } catch (err) {
      console.error("❌ Chat history error:", err.message);
    }
  });

  // 💬 Receive message
  socket.on("chatMessage", async ({ message, room, sender }) => {
    if (!message || !room || !sender) return;

    const msg = {
      sender,
      room,
      text: message,
      timestamp: new Date(),
    };

    try {
      await Message.create(msg); // ✅ Save
      io.to(room).emit("chatMessage", msg); // ✅ Broadcast to room only
    } catch (err) {
      console.error("❌ Message save error:", err.message);
    }
  });

  // ✍️ Typing indicator
  socket.on("typing", ({ room, username }) => {
    if (room && username) {
      socket.to(room).emit("typing", username);
    }
  });

  // 🔌 Disconnect
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      const { room, username } = user;

      socket.to(room).emit("chatMessage", {
        sender: "System",
        text: `${username} left the room`,
        timestamp: new Date(),
      });

      delete users[socket.id];
      io.to(room).emit("onlineUsers", getUsersInRoom(room));
    }

    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
