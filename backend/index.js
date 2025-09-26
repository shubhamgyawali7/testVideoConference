import express from "express";
import http from "http";
import { Server as SocketIo } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
const server = http.createServer(app);

// Middleware
app.use(morgan("combined"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

// Socket.IO setup
const io = new SocketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// In-memory store for users
const rooms = {}; // { roomId: { socketId: { username, userId } } }

io.on("connect", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, userId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);

    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = { username, userId };

    // Send existing users to the new user
    const existingUsers = Object.entries(rooms[roomId])
      .filter(([id]) => id !== socket.id)
      .map(([socketId, data]) => ({ socketId, ...data }));

    // ✅ Emit existing users to the joining user
    socket.emit("room-users", existingUsers);

    // Notify all other users in the room
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      userId,
      username,
    });
  });

  // WebRTC signaling
  socket.on("offer", ({ to, offer, from }) => {
    io.to(to).emit("offer", { offer, from });
  });

  socket.on("answer", ({ to, answer, from }) => {
    io.to(to).emit("answer", { answer, from });
  });

  socket.on("ice-candidate", ({ to, candidate, from }) => {
    io.to(to).emit("ice-candidate", { candidate, from });
  });

  // Chat message
  socket.on("chat-message", ({ roomId, message, userId, username }) => {
    io.to(roomId).emit("chat-message", { roomId, message, userId, username });
  });

  // Leave room
  socket.on("leave-room", leaveRoom);
  socket.on("disconnect", leaveRoom);

  function leaveRoom() {
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        const { username, userId } = rooms[roomId][socket.id];
        delete rooms[roomId][socket.id];
        socket.to(roomId).emit("user-left", {
          socketId: socket.id,
          userId,
          username,
        });
      }
    }
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📱 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`
  );
});

export { app, server, io };
