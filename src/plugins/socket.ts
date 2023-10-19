import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  room: {},
  users: {}
});

const url = "http://192.168.1.123:3000";

export const socket = io(url);

socket.on("connection", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on('new player', newPlayer => {
  console.log(newPlayer);
  const userId = newPlayer.userId
  delete newPlayer.userId
  state.users[userId] = newPlayer
})