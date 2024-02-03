<template>
  <UserList 
    :users="users"
    :room="room"
    @changeUser="changeUser"
  />
  <CharacterSheet
    :users="users"
    :room="room"
    :selectedUser="selectedUser"
  />
  <v-container>
    <v-row align="center" justify="center">
      <v-col sm="6">
        <DiceRoll/>
      </v-col>
      <v-col sm="3">
        <RollLogs
          :users="users"
          :rollLogs="rollLogs"
        />
      </v-col>
    </v-row>
  </v-container>
  <DisconnectSnackbar/>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { socket, state } from '@/plugins/socket';
  import UserList from '@/components/UserList.vue';
  import CharacterSheet from '@/components/CharacterSheet.vue';
  import DiceRoll from '@/components/DiceRoll.vue';
  import RollLogs from '@/components/rollLogs.vue';
  import DisconnectSnackbar from '@/components/DisconnectSnackbar.vue';

  export default defineComponent({
    data() {
      return {
        selectedUser: socket.id
      }
    },
    components: {
    CharacterSheet,
    UserList,
    DiceRoll,
    RollLogs,
    DisconnectSnackbar
},
    methods: {
      changeUser(newSelectedUser: string) {
        this.selectedUser = newSelectedUser
      }
    },
    setup() {
      const users = ref(state.users)
      const room = ref(state.room)
      const rollLogs = ref(state.rollLogs)

      watch(() => state, (state) => {
        users.value = state.users
        room.value = state.room
        rollLogs.value = state.rollLogs
      });

      return {
        users,
        room,
        rollLogs
      };
    },
  })
</script>