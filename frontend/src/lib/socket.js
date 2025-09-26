import { io } from "socket.io-client";
const socket = io(process.env.API_URL || "http://localhost:3001", {
  withCredentials: true,
});

export default socket;
