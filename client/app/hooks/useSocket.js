import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (roomID) => {
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();

  useEffect(() => {
    const socketURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : "wss://chunkr.up.railway.app";
    socketRef.current = io.connect(socketURL, {
      withCredentials: true,
    });
    socketRef.current.emit("join room", roomID);

    socketRef.current.on("room full", () => {
      alert("Room is full");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomID]);

  return { socketRef, loading, setLoading };
};

export default useSocket;
