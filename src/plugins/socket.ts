import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  room: {},
  users: {}
});

const url = "http://localhost:3000";

export const socket = io(url);

socket.on("connection", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on('new player', newPlayer => {
  const userId = newPlayer.userId
  delete newPlayer.userId
  state.users[userId] = newPlayer
})

socket.on('create or update personnage', (userId, characterData) => {
  state.room.players[userId] = characterData
})