"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlinePlus, AiOutlineEnter } from "react-icons/ai";
import generateRoomId from "@/app/utils/generateRoomId";

export default function Home() {
  const [joinRoomId, setJoinRoomId] = useState("");
  const [notification, setNotification] = useState("");
  const router = useRouter();

  const createRoom = () => {
    const id = generateRoomId();
    router.push(`/room/${id}`);
  };

  const joinRoom = () => {
    if (joinRoomId.trim()) {
      router.push(`/room/${joinRoomId}`);
    } else {
      showNotification("Please enter a valid Room ID");
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <main className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold mb-2">
            <span className="text-blue-600">chu</span>
            <span className="text-purple-600">nkr.</span>
          </h1>
          <p className="text-xl text-gray-400">Seamless File Sharing</p>
        </div>

        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create or Join a Room
          </h2>

          <button
            onClick={createRoom}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mb-6"
          >
            <AiOutlinePlus className="mr-2" size={24} />
            Create Room
          </button>

          <div className="mt-8">
            <p className="mb-3 text-gray-400 text-center">
              Or join an existing room:
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter 6-digit Room ID"
                className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors uppercase"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
            <button
              onClick={joinRoom}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 mt-4 flex items-center justify-center"
            >
              <AiOutlineEnter className="mr-2" size={24} />
              Join Room
            </button>
          </div>
        </div>

        {notification && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full animate-fade-in-out">
            {notification}
          </div>
        )}
      </main>

      <footer className="mt-12 text-gray-500">
        &copy; {new Date().getFullYear()} Chunkr. All rights reserved.
      </footer>
    </div>
  );
}
