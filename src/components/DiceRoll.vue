<template>
  <v-card>
    <v-card-title>Dice Roller</v-card-title>
    <v-card-subtitle>Choose your dice for the roll</v-card-subtitle>
    <v-card-text>
        <v-container>
            <v-row>
                <template v-for="(dice, key) in diceList">
                    <v-col sm="1">
                        <v-checkbox-btn
                            v-model="inputActivates[key]"
                            @update:modelValue="setDice(key)"
                        ></v-checkbox-btn>
                    </v-col>
                    <v-col sm="3">
                        <v-text-field
                            :prepend-inner-icon="dice === 100 ? 'mdi-cash-100' : `mdi-dice-d${dice}`"
                            :disabled="!inputActivates[key]"
                            hide-details
                            type="number"
                            label="Dice's number"
                            v-model="inputValues[key]"
                        >
                        </v-text-field>
                    </v-col>
                </template>
            </v-row>
            <v-row v-if="result">
                <v-col sm="12">
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-title>{{ result }}</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <template v-for="(value, dice) in resultDetails">
                                    <v-icon>{{ dice.toString().split('.')[0] === '100' ? 'mdi-cash-100' : `mdi-dice-d${dice.toString().split('.')[0]}`}}</v-icon>: {{ value }}<br>
                                </template>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </v-container>
    </v-card-text>
    <v-card-actions>
        <v-btn color="primary" @click="roll">
            Roll
        </v-btn>
        <v-btn color="error" @click="reset">
            Reset
        </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { socket, state } from '@/plugins/socket'

    interface  DiceResult {
      [key: string]: number | string
    }
    export default defineComponent({
        data() {
            return {
                diceList: [4, 6, 8, 10, 12, 20, 100],
                inputActivates: [false],
                inputValues: [0],
                result: '',
                resultDetails: {} as DiceResult,
                broadcast: true,
            }
        },
        mounted() {
            this.reset()
        },
        methods: {
            setDice(id: number) {
                this.inputValues[id] = this.inputActivates[id] ? 1 : 0;
            },
            roll() {
                const dices = []
                for (const [i, dice] of this.diceList.entries()) {
                    if (this.inputActivates[i]){
                        for (let j = 1; j <= this.inputValues[i]; j++) {
                            dices.push(`${dice}.${j}`)
                        }
                    }
                }
                
                socket.emit('roll', dices, this.broadcast, (result: { total: number, userId: string }) => {
                    state.rollLogs.push({...result})
                    this.result = `Result: ${result.total}`
                    const resultDetails: DiceResult = Object.fromEntries(
                      Object.entries(result).filter(([key]) => !['total', 'userId'].includes(key))
                    );
                    this.resultDetails = resultDetails
                })
            },
            reset() {
                this.inputActivates = [false, false, false, false, false, false , false]
                this.inputValues = [0, 0, 0, 0, 0, 0, 0]
                this.result = ''
                this.resultDetails = {} as DiceResult
            }
        }
    })
</script>