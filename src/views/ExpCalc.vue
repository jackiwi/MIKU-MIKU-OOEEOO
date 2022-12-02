<template>
  <h1>exp calc</h1>

  <div class="flex justify-around">
    <div class="w-4/5">
      <Field label="Mode">
        <button v-for="(value, key) in { rankup: 'rankup', char: 'char' }" :key="key" class="mr-1 mb-1"
          :class="{ 'opacity-25': mode !== key }" @click="mode = key">
          {{ value }}
        </button>
      </Field>
      
      <div v-if="mode==='char'">
        <Field label="beginner scores">
          <input type="number" v-model="smolSheets" step="50" />
        </Field>
        <Field label="intermediate scores">
          <input type="number" v-model="midSheets" step="50" />
        </Field>
      </div>

      <Field label="EXP needed">
        <input type="number" v-model="expNeeded" step="1000" :disabled="mode == 'char'" />
      </Field>

      <Field label="# Boosts">
        <div>
          <button v-for="(n,key) in 11" :key="key" @click="numBoosts = key" class="mr-1 mb-1"
            :class="{ 'opacity-25': numBoosts !== key }">
            {{ key }}
          </button>
        </div>
      </Field>

      <Field label="EXP boost">
        x{{ expBoost }}
      </Field>
    </div>
  </div>

  <div class="flex justify-around overscroll-none">
    <div class="w-3/5">
        <Field label="">
          <div class="flex w-full">
            <div class="flex-1"># games</div>
            <div class="flex-1">EXP</div>
          </div>
        </Field>
        <Field label="C rank: ">
          <div class="flex w-full">
            <div class="flex-1">{{ numGames.c_games.games }}</div>
            <div class="flex-1">{{ numGames.c_games.exp }}</div>
          </div>
        </Field>
        <Field label="B rank: ">
          <div class="flex w-full">
            <div class="flex-1">{{ numGames.b_games.games }}</div>
            <div class="flex-1">{{ numGames.b_games.exp }}</div>
          </div>
        </Field>
        <Field label="A rank: ">
          <div class="flex w-full">
            <div class="flex-1">{{ numGames.a_games.games }}</div>
            <div class="flex-1">{{ numGames.a_games.exp }}</div>
          </div>
        </Field>
        <Field label="S rank: ">
          <div class="flex w-full">
            <div class="flex-1">{{ numGames.s_games.games }}</div>
            <div class="flex-1">{{ numGames.s_games.exp }}</div>
          </div>
        </Field>
    </div>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue';
import calcGames from '@/composables/calcGames.js';
import Field from '@/components/Field.vue';
import { useLocalStorage } from '@vueuse/core';

export default {
  name: 'RankUpCalc',
  components: { Field },
  setup() {
    const numBoosts = useLocalStorage('numBoosts',2), expNeeded = useLocalStorage('expNeeded',10000);
    const mode = useLocalStorage('mode','rankup');
    const smolSheets = useLocalStorage('smolSheets',0), midSheets = useLocalStorage('midSheets',0);

    const expBoost = computed(() => {
      switch(numBoosts.value){
        case 0: return 1;
        case 1:
        case 2:
          return numBoosts.value * 5;
        case 3: return 14;
        case 4: return 17;
        case 10: return 25;
      }
      return 20 + (numBoosts.value % 5);
    });

    const numGames = useLocalStorage('numGames',null);

    watchEffect(() => {
      const numGamesRes = ref(calcGames(expNeeded.value, expBoost.value, mode.value));
      numGames.value = numGamesRes.value;
    });

    watchEffect(() => {
      if (mode.value === 'char'){
        expNeeded.value = smolSheets.value * 200 + midSheets.value * 10000;
      }
      else{
        expNeeded.value = useLocalStorage('expNeeded',10000).value;
      }
    });

    return { numBoosts, expNeeded, expBoost, numGames, mode, smolSheets, midSheets };
  }
}
</script>