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
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { socket, state } from '@/plugins/socket';
  import UserList from '@/components/UserList.vue';
  import CharacterSheet from '@/components/CharacterSheet.vue';

  export default defineComponent({
    data() {
      return {
        selectedUser: socket.id
      }
    },
    components: { 
      CharacterSheet,
      UserList
    },
    methods: {
      changeUser(newSelectedUser) {
        this.selectedUser = newSelectedUser
      }
    },
    setup() {
      const users = ref(state.users)
      const room = ref(state.room)

      watch(() => state, (state) => {
        users.value = state.users
        room.value = state.room
      });

      return {
        users,
        room
      };
    },
  })
</script>