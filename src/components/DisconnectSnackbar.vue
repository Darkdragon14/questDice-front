<template>
  <div class="text-center">
    <v-snackbar
        v-model="displaySnackbar"
        :timeout="timeout"
        color="warning"
    >
      {{ user }} is disconnected, due to {{ reason }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { socket, state } from '@/plugins/socket';

  export default defineComponent({
    data() {
      return {
        displaySnackbar: false,
        reason: '',
        timeout: 2000,
        user: ''
      }
    },
    mounted() {
      socket.on('user leave', (userId, reason) => {
        state.users[userId].isConnected = false;
        this.displaySnackbar = true;
        this.user = state.users[userId].name;
        this.reason = reason;
      })
    },
  })
</script>