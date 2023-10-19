<template>
  <v-navigation-drawer permanent>
    <v-divider></v-divider>
    <v-list-item title="Players"></v-list-item>
    <template v-for="(user, key) in users">
      <v-list-item link>
        {{ user.name }}
        <v-chip size="x-small" v-if="room.admin === key">
          Game Master
        </v-chip>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

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
    }
  })
</script>