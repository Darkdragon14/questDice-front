<template>
  <v-card>
    <v-card-title>Roll Logs</v-card-title>
    <v-card-text>
        <v-row>
          <v-col sm="12">
            <v-expansion-panels>
              <template v-if="rollLogs?.length" v-for="roll of currentRolls">
                <v-expansion-panel>
                    <v-expansion-panel-title>Result of {{ roll.userId === state.ownUserId ? 'Me' : users ? users[roll.userId].name : 'user not found'}}: {{ roll.total }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <template v-for="(value, dice) in roll">
                          <template v-if="!['total','userId'].includes(dice)">
                            <v-icon>{{ dice.split('.')[0] === '100' ? 'mdi-cash-100' : `mdi-dice-d${dice.split('.')[0]}`}}</v-icon>: {{ value }}<br>
                          </template>
                        </template>
                    </v-expansion-panel-text>
                </v-expansion-panel>
              </template>
            </v-expansion-panels>
          </v-col>
        </v-row>
    </v-card-text>
    <v-card-actions v-if="totalPage > 1">
      <v-container>
        <v-row justify="center">
          <v-col cols="8">
            <v-container class="max-width">
              <v-pagination
                v-model="page"
                :length="totalPage"
                rounded="circle"
              ></v-pagination>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { socket, state } from '@/plugins/socket'

  export default defineComponent({
    data() {
      return {
        page: 1,
        socket
      }
    },
    props: {
      users: {
        type: Object,
        require: true
      },
      rollLogs: {
        type: Object,
        require: true
      }
    },
    computed: {
      totalPage() {
        return this.rollLogs ? Math.ceil(this.rollLogs.length / 5) : 1
      },
      currentRolls(): { total: number, userId: string }[] {
        const startIndex = 5 * (this.page - 1)
        const lastIndex = startIndex + 5
        return this.rollLogs ? this.rollLogs.reverse().slice(startIndex, lastIndex) : []
      }
    }
  })
</script>