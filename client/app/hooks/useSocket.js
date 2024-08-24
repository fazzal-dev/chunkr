import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (roomID) => {
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("wss://chunkr.up.railway.app", {
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
