<template>
  <v-navigation-drawer
    permanent
    location="right"
  >
    <v-divider></v-divider>
    <template v-if="selectedUser !== room.admin">
      <v-list-item>
        {{ isOwnCharacter ? 'Your Character' : `${users[selectedUser].name}'s Character` }}
        <v-btn 
          v-if="isOwnCharacter || isAdmin"
          size="x-small"
          :icon="isNoEditionMode ? 'mdi-pencil' : 'mdi-content-save'"
          color="success"
          @click="toggleToEdit"
        >
        </v-btn>
      </v-list-item>

      <v-list v-for="characteristic in room.characteristicPlayer">
        <v-list-item>
          <v-text-field v-if="characteristic.type" 
            :disabled="isNoEditionMode" 
            :prepend-icon="characteristic.icon" 
            :label="characteristic.label" 
            :type="characteristic.type"
            @input="e => updateCharacteristc(characteristic.label, e.target.value)"
          />
          <template  v-else>
            <v-tooltip :ripple="false" :text="characteristic.label">
              <template v-slot:activator="{ props }">
                <v-icon style="margin-right: 10px;" v-bind="props">{{ characteristic.icon }}</v-icon>
              </template>
            </v-tooltip>
            {{ characteristic.label }}
          </template>
          
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { socket, state } from '@/plugins/socket';

  export default defineComponent({
    data() {
      return {
        socket,
        selectedUser: socket.id,
        isNoEditionMode: true,
        characterData: {}
      }
    },
    computed: {
      isOwnCharacter() {
        return this.selectedUser === socket.id
      },
      isAdmin() {
        return this.room.admin === socket.id
      }
    },
    props: {
      users: {
        type: Object,
        require: true
      },
      currentUserId: {
        type: Object,
        require: true
      },
      room: {
        type: Object,
        require: true
      }
    },
    methods: {
      toggleToEdit(){
        this.isNoEditionMode = !this.isNoEditionMode
        if(this.isNoEditionMode) {
          // Send new info to the server
          console.log(this.characterData)
        }
      },
      updateCharacteristc(key, value) {
        this.characterData[key] = value
      }
    }
  })
</script>