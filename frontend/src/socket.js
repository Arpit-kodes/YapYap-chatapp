import { io } from "socket.io-client";

// Use environment variable or fallback to localhost for development
const backendURL = import.meta.env.VITE_API_URL ;

export const socket = io(backendURL);
