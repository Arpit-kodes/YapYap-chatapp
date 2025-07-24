// src/socket.js
import { io } from "socket.io-client";

// Backend runs on port 5000
export const socket = io("http://localhost:5000");
