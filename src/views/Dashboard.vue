<template>
  <UserList 
    :users="users"
    :room="room"
  />
  <CharacterSheet
    :users="users"
    :room="room"
  />
  {{ room.name }}#{{ room.id }}
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { socket, state } from '@/plugins/socket';
  import UserList from '@/components/UserList.vue';
  import CharacterSheet from '@/components/CharacterSheet.vue';

  export default defineComponent({
    components: { 
      CharacterSheet,
      UserList
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