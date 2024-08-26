"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSocket from "@/app/hooks/useSocket";
import usePeer from "@/app/hooks/usePeer";
import FileUpload from "@/app/components/FileUpload";
import FileReceive from "@/app/components/FileReceive";
import UserInfo from "@/app/components/UserInfo";
import BackgroundAnimation from "@/app/components/BackgroundAnimation";
import { generateUserName } from "@/app/utils/nameGenerator";
import { AiOutlineLoading3Quarters, AiOutlineCopy } from "react-icons/ai";
import { RiSignalTowerLine } from "react-icons/ri";

const Room = () => {
  const { id: roomID } = useParams();
  const [userName, setUserName] = useState("");
  const [copyNotification, setCopyNotification] = useState(false);

  const { socketRef, loading, setLoading } = useSocket(roomID);
  const {
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
  } = usePeer(socketRef, setLoading);

  useEffect(() => {
    setUserName(generateUserName());
  }, []);

  const copyRoomID = () => {
    navigator.clipboard
      .writeText(roomID)
      .then(() => showNotification("Room ID copied to clipboard!"))
      .catch(() => showNotification("Failed to copy Room ID"));
  };

  const showNotification = (message) => {
    setCopyNotification(message);
    setTimeout(() => setCopyNotification(false), 3000);
  };
  console.log("connection", connection);

  const getConnectionIcon = () => {
    if (loading) {
      return (
        <RiSignalTowerLine
          size={24}
          className="text-gray-500 animate-pulse"
          title="Establishing connection"
        />
      );
    } else if (connection) {
      return (
        <RiSignalTowerLine
          size={24}
          className="text-green-600"
          title="Connection established"
        />
      );
    } else {
      return (
        <RiSignalTowerLine
          size={24}
          className="text-gray-500"
          title="Waiting for connection"
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-extrabold">
            <span className="text-blue-600">chu</span>
            <span className="text-purple-600">nkr.</span>
          </h1>
          <p className="text-xl mt-2 text-gray-400">Seamless File Sharing</p>
        </header>

        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">
                Room: <span className="text-blue-400">{roomID}</span>
              </h2>
              {getConnectionIcon()}
            </div>
            <button
              onClick={copyRoomID}
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-3 transition-all duration-300 ease-in-out transform hover:scale-110"
              title="Copy Room ID"
            >
              <AiOutlineCopy size={24} className="text-gray-300" />
            </button>
          </div>

          <UserInfo userName={userName} />

          {loading ? (
            <div className="flex flex-col items-center">
              <AiOutlineLoading3Quarters className="animate-spin text-5xl mb-4 text-blue-500" />
              <h2 className="text-xl font-semibold">
                Establishing connection...
              </h2>
            </div>
          ) : connection ? (
            <>
              <FileUpload
                file={file}
                setFile={setFile}
                sendFile={sendFile}
                uploadProgress={uploadProgress}
                isSending={isSending}
              />
              <FileReceive
                isReceivingFile={isReceivingFile}
                fileReceived={fileReceived}
                receivedFileName={receivedFileName}
                downloadProgress={downloadProgress}
                receivedFileBlob={receivedFileBlob}
              />
            </>
          ) : (
            <h2 className="text-xl text-center font-semibold">
              Waiting for peer connection...
            </h2>
          )}
        </div>
      </div>
      {copyNotification && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full animate-fade-in-out">
          {copyNotification}
        </div>
      )}
    </div>
  );
};

export default Room;
