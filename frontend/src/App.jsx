import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import RoomSelector from "./pages/RoomSelector";

// Components
import ChatRoom from "./components/ChatRoom";

function App() {
  return (
    <Routes>
      {/* Login or Guest Join Page */}
      <Route path="/" element={<Home />} />

      <Route path="/rooms" element={<RoomSelector />} />

      {/* Main Chat Interface */}
      <Route path="/chat" element={<ChatRoom />} />
    </Routes>
  );
}

export default App;
