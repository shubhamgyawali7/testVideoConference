import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  room: null,
  peers: {}, // changed from array to object
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
      state.chatMessages[roomId] = [...(state.chatMessages[roomId] || []), msg];
    },
    addPeer: (state, action) => {
      const { socketId, userId, username, stream } = action.payload;

      state.peers[socketId] = {
        ...(state.peers[socketId] || {}),
        userId,
        username,
        stream:
          stream ||
          (state.peers[socketId] && state.peers[socketId].stream) ||
          null,
      };
    },
    removePeer: (state, action) => {
      const socketId = action.payload;
      delete state.peers[socketId];
    },
  },
});

export const { setUser, setRoom, addChatMessage, addPeer, removePeer } =
  conferenceSlice.actions;
export default conferenceSlice.reducer;
