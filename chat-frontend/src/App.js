import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Login from "./components/Login";
import Chat from "./components/Chat";

const socket = io("http://localhost:3000");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat socket={socket} token={token} />
      )}
    </div>
  );
}

export default App;
