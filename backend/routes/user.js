const express = require("express");
const router = express.Router();
const { findUserByUsername } = require("../controllers/userController");

router.get("/:username", findUserByUsername);

module.exports = router;
