<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        />
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="username"
            label="Username"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="4"
        />
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="room"
            label="Channel Name"
            required
          />
        </v-col>
      </v-row>
      <v-row v-if="errorMessage">
        <v-col
          cols="12"
          md="4"
        />
        <v-col md="4">
          <v-alert
            color="error"
            icon="$error"
          >
            {{ errorMessage }}
          </v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="4"
        />
        <v-col
          cols="12"
          md="2"
        >
          <v-btn
            color="primary"
            class="mt-4"
            block
            :disabled="isDisabled"
            :loading="isCreating"
            @click="create"
          >
            Create
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-btn
            color="secondary"
            class="mt-4"
            block
            :disabled="isDisabled"
            :loading="isJoining"
            @click="join"
          >
            Join
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <CreateChannelModel 
    :isOpen="isCreating"
    :close="stopCreatingChannel"
    :room="room"
    :username="username"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import CreateChannelModel from '@/components/CreateChannelModal.vue'
  import { socket, state } from '@/plugins/socket';

  export default defineComponent({
    components: {
      CreateChannelModel
    },
    data() {
      return {
        isCreating: false,
        isJoining: false,
        username: '',
        room: '',
        errorMessage: ''
      }
    },
    computed: {
      isDisabled() {
        return this.isCreating || this.isJoining;
      }
    },
    mounted() {
      state.users = {}
      state.room = {}
    },
    methods: {
      create() {
        socket.connect()
        this.isCreating = true 
      },
      join() {
        this.isJoining = true 
        socket.emit('user', this.username, (infoUser: {name: string}) => {
          state.users[socket.id] = infoUser
        })
        socket.emit('join room', this.room, (infoRoom: {
          joinning: boolean, 
          room: {
            name: string,
            admin: string,
            users: string[],
            player: {},
            maxPlayers: number,
            characteristicPlayer: []
          },
          error: string
        }) => {
          if (infoRoom.error) {
            this.errorMessage = infoRoom.error
            this.isJoining = false
            return
          }
          
          state.room = infoRoom.room
          socket.emit('users in channel', infoRoom.room.users, (users: object) => {
            state.users = users
          })
          this.$router.push('/dashboard')
        })
      },
      stopCreatingChannel() {
        this.isCreating = false
      }
    }
  })
</script>
