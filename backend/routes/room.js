const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.get("/", async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Room name required" });

  const exists = await Room.findOne({ name });
  if (exists) return res.status(409).json({ error: "Room already exists" });

  const newRoom = await Room.create({ name });
  res.status(201).json(newRoom);
});

module.exports = router;
