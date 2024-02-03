<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi-dice-d20" />

      Quest Dice
    </v-app-bar-title>
    <template v-if="currentRouteName !== 'Home'" v-slot:append>
      <v-btn icon="mdi-logout" @click="logout"></v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { socket } from '@/plugins/socket'
  const defaultPath = import.meta.env.VITE_DEFAULT_PATH

  export default defineComponent({
    computed: {
      currentRouteName() {
        return this.$route.name;
      }
    },
    methods: {
      logout() {
        socket.emit('logout', 'due to logout')
        this.resetData()
        this.redirectToHome()
      },
      redirectToHome() {
        this.$router.push(`${defaultPath}`)
      },
      resetData() {
        console.log('reset')
      }
    }
  })
</script>
