const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const socket = require("socket.io");
//RoomId's to Array of socket Id's
const users = {};
//socket Id's to RoomId's
const socketToRoom = {};

app.use(
  cors({
    origin: ["https://chunkr-server.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const io = socket(server, {
  cors: {
    origin: ["https://chunkr-server.vercel.app", "http://localhost:3000"],
    allowedHeaders: ["Content-Type"],
  },
});

io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 2) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
      socket.broadcast.emit("user left", socket.id);
    }
  });

  console.log(users);
  console.log(socketToRoom);
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);
