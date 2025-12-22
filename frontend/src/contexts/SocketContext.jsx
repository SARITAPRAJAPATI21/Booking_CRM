// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create context
const SocketContext = createContext();

// Hook to use socket
export const useSocket = () => useContext(SocketContext);

// Provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000"); // your backend URL
    setSocket(newSocket);

    console.log("Socket connected");

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
