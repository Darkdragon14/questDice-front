import { reactive } from "vue";
import { io } from "socket.io-client";

interface State {
    connected: boolean;
    room: {
        id: string,
        name: string,
        admin: string,
        users: string[],
        players: {
            [key: string]: object
        },
        maxPlayers: number,
        characteristicPlayer: object[]
    };
    users: any;
    rollLogs: {
        total: number,
        userId: string
    }[];
}

export const state: State = reactive({
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

socket.on('dice result', result => {
  state.rollLogs.push(result)
})