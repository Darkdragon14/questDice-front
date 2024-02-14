import { reactive } from "vue";
import { io } from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL
const backendPath = import.meta.env.VITE_BACKEND_PATH || '/socket.io'

export interface Room {
  id: string,
  name: string,
  admin: string,
  users: string[],
  players: {
    [key: string]: object
  },
  maxPlayers: number,
  characteristicPlayer: object[],
  error?: string
}

export interface State {
  ownUserId: string,
  connected: boolean;
  room: Room;
  users: any;
  rollLogs: {
      total: number,
      userId: string
  }[];
}

export const state: State = reactive({
  ownUserId: '',
  connected: false,
  room: {
    id: '',
    name: '',
    admin: '',
    users: [],
    players: {},
    maxPlayers: 0,
    characteristicPlayer: []
  },
  users: {},
  rollLogs: []
});

export const socket = io(backendUrl, {path: backendPath});

socket.on("connection", userId => {
  state.connected = true;
  state.ownUserId = userId;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on('user join', newPlayer => {
  const userId = newPlayer.userId
  delete newPlayer.userId
  state.users[userId] = newPlayer
})

socket.on('create or update personnage', (userId, characterData) => {
  state.room.players[userId] = characterData
})

socket.on('dice result', result => {
  state.rollLogs.push(result)
})