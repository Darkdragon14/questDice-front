<template>
  <v-dialog 
    v-model="isOpen"
    transition="dialog-top-transition"
    persistent
    max-width="1000px"
  >
      <v-card>
        <v-card-title>
          <span class="text-h5">Characteristic Player</span>
        </v-card-title>
        <v-card-text min-height="500px">
          <v-container>
            <v-row>
              <v-col
                lg="4"
              >
                <v-text-field
                  v-model="maxPlayers"
                  label="Maximum number of players"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-list>
            <template v-for="(characteristic, key) in characteristicsList">
              <v-container>
                <v-row>
                  <v-col
                    lg="3"
                  >
                    <v-btn
                      icon 
                      elevation="0"
                      @click="removeElement(key, '')"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <v-btn 
                      icon 
                      elevation="0"
                      :disabled="key === 0"
                      @click="moveElement(key, true, '')"
                    >
                      <v-icon>mdi-arrow-up-thick</v-icon>
                    </v-btn>
                    <v-btn 
                      icon 
                      elevation="0"
                      :disabled="key === (characteristicsList.length - 1)"
                      @click="moveElement(key, false, '')"
                    >
                      <v-icon>mdi-arrow-down-thick</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col
                    lg="8"
                  >
                    <v-list-item v-if="!characteristic.hasSubgroup" :prepend-icon="characteristic.icon" :title="characteristic.label" :subtitle="characteristic.type"/>
                    <v-list-group v-else :value="characteristic.label">
                      <template v-slot:activator="{ props }">
                        <v-list-item
                          v-bind="props"
                          :prepend-icon="characteristic.icon"
                          :title="characteristic.label"
                        ></v-list-item>
                      </template>
                      <v-list-item style="padding-inline-start: 0 !important;">
                        <template v-for="(subCharacteristic, key) in characteristic.subgroup">
                          <v-container style="padding-left: 0px; padding-right: 0px;">
                            <v-row>
                              <v-col
                                sm="4"
                              >
                              <v-btn
                                icon 
                                elevation="0"
                                @click="removeElement(key, characteristic.label)"
                              >
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>
                                <v-btn 
                                  icon 
                                  elevation="0"
                                  :disabled="key === 0"
                                  @click="moveElement(key, true, characteristic.label)"
                                >
                                  <v-icon>mdi-arrow-up-thick</v-icon>
                                </v-btn>
                                <v-btn 
                                  icon 
                                  elevation="0"
                                  :disabled="key === (characteristicsList.length - 1)"
                                  @click="moveElement(key, false, characteristic.label)"
                                >
                                  <v-icon>mdi-arrow-down-thick</v-icon>
                                </v-btn>
                              </v-col>
                              <v-col
                                sm="8"
                              >
                                <v-list-item style="padding-inline-start: 16px !important;" :prepend-icon="subCharacteristic.icon" :title="subCharacteristic.label"/>
                              </v-col>
                            </v-row>
                          </v-container>
                        </template>
                      </v-list-item>
                    </v-list-group>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <v-container style="border: 1px solid rgb(133, 133, 133);border-radius: 5px;">
              <v-row>
                <v-col col="12">
                  <span class="text-h6">
                    Add a characteristic
                    <v-btn 
                      size="x-small"
                      icon="mdi-plus"
                      color="success"
                      @click="showForm = !showForm"
                    >
                    </v-btn>
                  </span>
                </v-col>
              </v-row>
              <template v-if="showForm">
                <v-row>
                  <v-col sm="4">
                    <v-text-field
                      v-model="icon"
                      label="Icon"
                      required
                    />
                  </v-col>
                  <v-col sm="4">
                    <v-text-field
                      v-model="characteristic"
                      label="Characteristic"
                      required
                    />
                  </v-col>
                  <v-col sm="4">
                    <v-select
                      label="Type"
                      v-model="type"
                      :items="optionsType"
                    ></v-select>
                  </v-col>
                  <v-col sm="4">
                    <v-select
                      label="Subgroup"
                      v-model="option"
                      :items="options"
                    ></v-select>
                  </v-col>
                  <v-col sm="2">
                    <v-btn 
                      style="top: 50%;transform: translatey(-50%);"
                      color="primary"
                      elevation="0"
                      @click="addElement()"
                    >
                      Add
                    </v-btn>
                  </v-col>
                </v-row>
                <v-alert 
                  color="success"
                  icon="$success"
                >
                  You can find icons <a href="https://mdisearch.com/" target="_blank">here</a>
                </v-alert>
              </template>
            </v-container>
          </v-list>
          <v-alert
            v-if="errorMessage"
            color="error"
            icon="$error"
          >
            {{ errorMessage }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          
          <v-btn
            color="primary"
            text="Create"
            :disabled="isSubmit"
            :loading="isSubmit"
            @click="submit"
          />
          <v-btn
            color="error"
            text="Cancel"
            @click="close"
          />
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { socket, state } from '@/plugins/socket'
  import defaultCharacteristicList from '@/assets/defaultCharacteristicList.json'
  const defaultPath = import.meta.env.VITE_DEFAULT_PATH

  interface Characteristic {
    label: string;
    icon: string;
    hasSubgroup: boolean;
    type: string;// ou le type correct pour subgroup
  }

  interface CharacteristicWithSubgroup extends Characteristic {
    subgroup: Characteristic[];
  }


  export default defineComponent({
    props: {
      isOpen: {
        type: Boolean,
        require: true
      },
      close: {
        type: Function
      },
      room: {
        type: String,
        require: true
      },
      username: {
        type: String,
        require: true
      }
    },
    data() {
      return {
        isSubmit: false,
        characteristic: '',
        icon: '',
        options: ['Name', 'HP'],
        option: '',
        hasSubgroup: false,
        characteristicsList: defaultCharacteristicList as CharacteristicWithSubgroup[],
        maxPlayers: 4,
        errorMessage: '',
        optionsType: ["Text", "Large Text", "Number"],
        type: '',
        showForm: false
      }
    },
    methods: {
      submit() {
        socket.emit('user', this.username, (infoUser: {name: string}) => {
          state.users[state.ownUserId] = infoUser
        })

        socket.emit('create room', this.room, this.maxPlayers, this.characteristicsList, (channel: {
          creating: boolean,
          room: {
            id: string,
            name: string,
            admin: string,
            users: string[],
            players: { [key: string]: object },
            maxPlayers: number,
            characteristicPlayer: object[]
          }, 
          error: string
        }) => {
          if (channel.error) {
            this.errorMessage = channel.error
            return
          }

          state.room = channel.room
          localStorage.setItem("myOwnId", state.ownUserId);
          localStorage.setItem("oldRoom", `${state.room?.name}#${state.room?.id}`);
          this.$router.push(`${defaultPath}/dashboard`)
        })
      },
      moveElement(currentKey: number, up: boolean, label: string) {
        const newKey = up ? currentKey - 1 : currentKey + 1
        
        if (!label) {
          this.characteristicsList[currentKey] = this.characteristicsList.splice(newKey, 1, this.characteristicsList[currentKey])[0]
          return
        }

        const index =  this.characteristicsList.findIndex(characteristic => characteristic.label === label)
        this.characteristicsList[index].subgroup[currentKey] = this.characteristicsList[index].subgroup.splice(newKey, 1, this.characteristicsList[index].subgroup[currentKey])[0]
      },
      addElement() {
        if (!this.characteristic) {
          return;
        }
        const objectToPush: CharacteristicWithSubgroup = {
          label: this.characteristic,
          icon: `mdi-${this.icon || 'dice-d20'}`,
          hasSubgroup: this.hasSubgroup,
          type: this.type,
          subgroup: []
        }
        
        this.resetForm()
        if (this.option === '') {
          this.options.push(objectToPush.label)
          this.characteristicsList.push(objectToPush)
          return
        }
        
        const index =  this.characteristicsList.findIndex(characteristic => characteristic.label === this.option)
        this.characteristicsList[index].hasSubgroup = true
        this.characteristicsList[index].subgroup.push(objectToPush)
        this.option = ''
      },
      removeElement(key: number, label: string) {
        if (!label) {
          this.options.splice(key, 1)
          this.characteristicsList.splice(key, 1)
          return;
        }

        const index =  this.characteristicsList.findIndex(characteristic => characteristic.label === label)
        this.characteristicsList[index].subgroup.splice(key, 1)
        if (!this.characteristicsList[index].subgroup.length) {
          this.characteristicsList[index].hasSubgroup = false
        }
      },
      resetForm() {
        this.characteristic = ''
        this.icon = ''
        this.hasSubgroup = false
      }
    }
  })
</script>