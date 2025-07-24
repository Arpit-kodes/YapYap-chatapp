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

// ✅ Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend domain in production
    methods: ["GET", "POST"],
  },
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ✅ Models
const Message = require("./models/Message");

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
      timestamp: new Date(),
    });

    io.to(room).emit("onlineUsers", getUsersInRoom(room));

    // ✅ Send Chat History (on join)
    Message.find({ room })
      .sort({ timestamp: 1 })
      .limit(50)
      .then((history) => {
        socket.emit("chatHistory", history);
      });
  });

  socket.on("chatMessage", async ({ message, room, sender }) => {
    if (!message || !room || !sender) return;

    const msgObj = {
      room,
      sender,
      text: message,
      timestamp: new Date(),
    };

    // ✅ Emit to all in room
    io.to(room).emit("chatMessage", msgObj);

    // ✅ Save to DB
    try {
      await Message.create(msgObj);
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
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
        timestamp: new Date(),
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
