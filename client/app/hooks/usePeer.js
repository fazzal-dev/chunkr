import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { iceServers } from "@/app/config/iceServers";

const usePeer = (socketRef, setLoading) => {
  const [connection, setConnection] = useState(false);
  const [file, setFile] = useState(null);
  const [fileReceived, setFileReceived] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [receivedFileName, setReceivedFileName] = useState("");
  const [isReceivingFile, setIsReceivingFile] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [receivedFileBlob, setReceivedFileBlob] = useState(null);
  const [lastReceivedChunk, setLastReceivedChunk] = useState(-1);

  const peerRef = useRef();
  const fileNameRef = useRef("");
  const workerRef = useRef(null);
  const receivedSizeRef = useRef(0);
  const totalSizeRef = useRef(0);
  const chunksRef = useRef({});

  useEffect(() => {
    socketRef.current.on("all users", (users) => {
      if (users.length > 0) {
        peerRef.current = createPeer(users[0], socketRef.current.id);
      }
    });

    socketRef.current.on("user joined", (payload) => {
      peerRef.current = addPeer(payload.signal, payload.callerID);
    });

    socketRef.current.on("receiving returned signal", (payload) => {
      peerRef.current.signal(payload.signal);
      setConnection(true);
      setLoading(false);
    });

    if (typeof window !== "undefined") {
      workerRef.current = new Worker("/worker.js");
      workerRef.current.onmessage = handleWorkerMessage;
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  function createPeer(userToSignal, callerID) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: iceServers,
      },
      channelConfig: {
        ordered: true,
      },
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    peer.on("data", handleReceivingData);

    peer.on("connect", () => {
      console.log("Peer connection established");
      setConnection(true);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
      setConnection(false);
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      setConnection(false);
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      config: {
        iceServers: iceServers,
      },
      channelConfig: {
        ordered: true,
      },
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.on("data", handleReceivingData);

    peer.on("connect", () => {
      console.log("Peer connection established");
      setConnection(true);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
      setConnection(false);
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      setConnection(false);
    });

    peer.signal(incomingSignal);
    setConnection(true);
    setLoading(false);
    return peer;
  }
  function handleReceivingData(data) {
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing received data:", error);
      return;
    }

    if (parsed.fileInfo) {
      setReceivedFileName(parsed.fileName);
      setIsReceivingFile(true);
      setDownloadProgress(0);
      receivedSizeRef.current = 0;
      totalSizeRef.current = parsed.fileSize;
      fileNameRef.current = { name: parsed.fileName, type: parsed.fileType };
      chunksRef.current = {};
      setLastReceivedChunk(-1);

      workerRef.current.postMessage({
        type: "fileInfo",
        fileName: parsed.fileName,
        fileType: parsed.fileType,
        fileSize: parsed.fileSize,
      });
    } else if (parsed.chunkIndex !== undefined) {
      chunksRef.current[parsed.chunkIndex] = new Uint8Array(parsed.data);
      receivedSizeRef.current += parsed.data.length;

      if (parsed.chunkIndex === lastReceivedChunk + 1) {
        setLastReceivedChunk(parsed.chunkIndex);
      }

      if (parsed.isLastChunk) {
        assembleFile();
      }

      if (peerRef.current && !peerRef.current.destroyed) {
        peerRef.current.write(JSON.stringify({ ack: parsed.chunkIndex }));
      }

      const progress = Math.round(
        (receivedSizeRef.current / totalSizeRef.current) * 100
      );
      setDownloadProgress(progress);
    } else if (parsed.ack !== undefined) {
    } else {
      console.warn("Received unknown data format", parsed);
    }
  }

  function assembleFile() {
    const sortedChunks = Object.keys(chunksRef.current)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((key) => chunksRef.current[key]);

    const blob = new Blob(sortedChunks, { type: fileNameRef.current.type });
    setReceivedFileBlob(blob);
    setFileReceived(true);
    setIsReceivingFile(false);
    setDownloadProgress(100);
  }

  function sendFile() {
    const peer = peerRef.current;
    if (!peer || peer.destroyed) {
      return;
    }

    setIsSending(true);
    peer.write(
      JSON.stringify({
        fileInfo: true,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })
    );

    const chunkSize = 16384; // 16KB chunk size
    const fileReader = new FileReader();
    let offset = 0;
    let uploadedSize = 0;
    const fileSize = file.size;
    let chunkIndex = 0;

    const sendNextChunk = () => {
      const chunk = file.slice(offset, offset + chunkSize);
      offset += chunkSize;

      fileReader.readAsArrayBuffer(chunk);
    };

    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const buffer = new Uint8Array(arrayBuffer);

      peer.write(
        JSON.stringify({
          chunkIndex: chunkIndex,
          data: Array.from(buffer),
          isLastChunk: offset >= fileSize,
        })
      );
      uploadedSize += buffer.length;
      setUploadProgress(Math.round((uploadedSize / fileSize) * 100));

      chunkIndex++;

      if (offset < fileSize) {
        sendNextChunk();
      } else {
        setIsSending(false);
        setUploadProgress(0);
      }
    };

    fileReader.onerror = (error) => {
      console.error("Error reading file:", error);
      setIsSending(false);
    };

    sendNextChunk();
  }

  function handleWorkerMessage(event) {
    if (event.data.type === "fileComplete") {
      const blob = new Blob(event.data.chunks, { type: event.data.fileType });
      setReceivedFileBlob(blob);
      setFileReceived(true);
      setIsReceivingFile(false);
      setDownloadProgress(100);
    }
  }

  return {
    peerRef,
    file,
    setFile,
    sendFile,
    receivedFileBlob,
    isReceivingFile,
    fileReceived,
    downloadProgress,
    uploadProgress,
    isSending,
    receivedFileName,
    connection,
  };
};

export default usePeer;
