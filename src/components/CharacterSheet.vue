<template>
  <v-navigation-drawer
    permanent
    location="right"
  >
    <v-divider></v-divider>
    <template v-if="users && selectedUser && (selectedUser !== room?.admin || room?.gameMasterIsAPlayer)">
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

      <v-list v-for="characteristic in room?.characteristicPlayer">
        <v-list-item>
          <v-text-field v-if="characteristic.type" 
            :disabled="isNoEditionMode" 
            :prepend-icon="characteristic.icon" 
            :label="characteristic.label" 
            :type="characteristic.type"
            :model-value="room?.players[selectedUser][characteristic.label]"
            @input="(e: Event) => updateCharacteristic(characteristic.label, (e.target as HTMLInputElement).value, null)"
          />
          <template  v-else>
            <v-list-group>
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <v-tooltip :ripple="false" :text="characteristic.label">
                    <template v-slot:activator="{ props }">
                      <v-icon style="margin-right: 10px;" v-bind="props">{{ characteristic.icon }}</v-icon>
                    </template>
                  </v-tooltip>
                  {{ characteristic.label }}
                </v-list-item>
              </template>
              <v-list-item v-for="subCharacteristic in characteristic.subgroup">
                <v-text-field v-if="subCharacteristic.type" 
                  :disabled="isNoEditionMode" 
                  :prepend-icon="subCharacteristic.icon" 
                  :label="subCharacteristic.label" 
                  :type="subCharacteristic.type"
                  :model-value="room?.players[selectedUser][characteristic.label][subCharacteristic.label]"
                  @input="(e: Event) => updateCharacteristic(subCharacteristic.label, (e.target as HTMLInputElement).value, characteristic.label)"
                />
              </v-list-item>
            </v-list-group>
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
        isNoEditionMode: true
      }
    },
    computed: {
      isOwnCharacter() {
        return this.selectedUser === state.ownUserId
      },
      isAdmin() {
        return this.room?.admin === state.ownUserId
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
      },
      selectedUser: {
        type: String,
        require: true
      }
    },
    methods: {
      toggleToEdit(){
        this.isNoEditionMode = !this.isNoEditionMode
        if(this.isNoEditionMode && this.room && this.selectedUser) {
          // Send new info to the server
          this.socket.emit('create or update personnage', this.selectedUser, this.room.players[this.selectedUser], (result: string) => {
            console.log(result);
          })
        }
      },
      updateCharacteristic(key: string, value: any, characteristicLabel: string | null) {
        if (this.room && this.selectedUser) {
          characteristicLabel ? this.room.players[this.selectedUser][characteristicLabel][key] = value : this.room.players[this.selectedUser][key] = value
        }
      }
    }
  })
</script>