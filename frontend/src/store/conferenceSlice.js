import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  room: null,
  peers: [],
  chatMessages: {},
};

const conferenceSlice = createSlice({
  name: "conference",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRoom: (state, action) => {
      state.room = action.payload;
    },
    addChatMessage: (state, action) => {
      const { roomId, ...msg } = action.payload;

      state.chatMessages = {
        ...state.chatMessages,
        [roomId]: [...(state.chatMessages[roomId] || []), msg],
      };
    },
    addPeer: (state, action) => {
      const { socketId, userId, username, stream } = action.payload;

      // Check if peer already exists
      const existingIndex = state.peers.findIndex(
        (p) => p.socketId === socketId
      );

      if (existingIndex !== -1) {
        // Update existing peer (e.g., add stream)
        state.peers[existingIndex] = {
          ...state.peers[existingIndex],
          userId,
          username,
          stream: stream || state.peers[existingIndex].stream,
        };
      } else {
        // Add new peer
        state.peers.push({
          socketId,
          userId,
          username,
          stream: stream || null,
        });
      }
    },
    removePeer: (state, action) => {
      const socketId = action.payload;
      state.peers = state.peers.filter((p) => p.socketId !== socketId);
    },
  },
});

export const { setUser, setRoom, addChatMessage,addPeer,removePeer } = conferenceSlice.actions;
export default conferenceSlice.reducer;
