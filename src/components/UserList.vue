<template>
  <v-navigation-drawer permanent>

    <v-divider></v-divider>
    <v-list-item-title>Channel</v-list-item-title>
    <v-list-item :title="roomName" append-icon="mdi-content-copy" @click="copyRoom"></v-list-item>
    <v-divider></v-divider>
    <v-list-item-title>Players</v-list-item-title>
    <template v-for="(user, key) in users">
      <v-list-item @click="changeUser(key)">
        {{ user.name }}
        <v-icon v-if="!user.isConnected">mdi-account-off</v-icon>
        <v-chip size="x-small" v-if="room && room.admin === key">
          Game Master
        </v-chip>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { state } from '@/plugins/socket';

  export default defineComponent({
    props: {
      users: {
        type: Object,
        require: true
      },
      room: {
        type: Object,
        require: true
      }
    },
    computed: {
      roomName() {
        return `${this.room?.name}#${this.room?.id}`
      }
    },
    methods: {
      copyRoom() {
        navigator.clipboard.writeText(this.roomName)
      },
      changeUser(userKey: String) {
        this.$emit('changeUser', userKey)
      }
    }
  })
</script>