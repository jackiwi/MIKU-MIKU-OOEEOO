<template>
  <h1 class="mb-5">resource calc</h1>

  <div class="flex justify-around">
    <div class="w-4/5">

      show deco leveling <input type="checkbox" v-model="showDecoCalc" />
      <div v-if="showDecoCalc">
        <Field label="decoration">
          <button v-for="(key) in ['character','unit','miku','vs-unit','plant']" :key="key" class="mr-1 mb-1"
            :class="{ 'opacity-25': decoration !== key }" @click="decoration = key">
            {{ key }}
          </button>
        </Field>

        <Field label="start level">
          <div>
            <button v-for="(n,key) in 11" :key="key" @click="startLevel = key" class="mr-1 mb-1"
              :class="{ 'opacity-25': startLevel !== key }">
              {{ key }}
            </button>
          </div>
        </Field>

        <Field label="end level">
          <div>
            <button v-for="(n,key) in 11" :key="key" @click="endLevel = key" class="mr-1 mb-1"
              :class="{ 'opacity-25': endLevel !== key }"
              :disabled="key < startLevel">
              {{ key }}
            </button>
          </div>
        </Field>

        <div class="flex justify-center">
          <div class="w-2/5 rounded ring ring-amber-400 p-4">
            <Field label="coins needed">
              {{ decoCoins }}
            </Field>
            <Field v-if="decoration != 'plant'" label="charms needed">
              {{ decoCharms }}
            </Field>
            <Field v-if="decoration != 'plant'" label="gems needed">
              {{ decoGems }}
            </Field>
            <Field v-if="decoration == 'plant'" label="seeds needed">
              {{ decoSeeds }}
            </Field>
          </div>
        </div>

      </div>



      <Field class="mt-8" label="item">
        <div class="">
          <span v-for="(key,value) in images" :key="key" class="help">
            <button @click="itemSelected = key" class="mr-1 mb-1 p-1"
                :class="{ 'opacity-30': itemSelected !== key }">
              <img class="w-9 h-9" :src="`${ require('@/assets/icon/'+ key +'.png') }`"/>
            </button>
            <span class="tooltip mb-5 ml-2">
              {{ value }}
            </span>
          </span>
        </div>

      </Field>

      <Field label="how many ya got">
        <input type="number" v-model="itemCurrent" step="10" />
      </Field>

      <Field label="how many ya want">
        <input type="number" v-model="itemGoal" step="10" />
      </Field>

      <Field label="when do ya want em by" >
        <input type="date" v-model="itemDeadline" />
      </Field>

      <Field label="time remaining">
        {{ timeRemaining.dateDiffString }}
      </Field>
    </div>
  </div>

  <div class="flex justify-around">
    <div class="w-3/5">

      <Field label="event shop">
        <div class="flex flex-col justify-center">
          <span>
            {{ baseNums.eventShop }} x {{ multipliers.eventShop }} = {{ values.eventShop }}
            <input type="checkbox" v-model="includeVal.eventShop" />
          </span>
        </div>
      </Field>

      <Field label="daily challenge live">
        <div class="flex flex-col justify-center">
          <span>
            {{ baseNums.dailyCL }} x {{ multipliers.dailyCL }} = {{ values.dailyCL }}
            <input type="checkbox" v-model="includeVal.dailyCL" />
          </span>
        </div>
      </Field>

      <Field label="weekly challenge live">
        <div class="flex flex-col justify-center">
          <span>
            {{ baseNums.weeklyCL }} x {{ multipliers.weeklyCL }} = {{ values.weeklyCL }}
            <input type="checkbox" v-model="includeVal.weeklyCL" />
          </span>
        </div>
      </Field>
    </div>
  </div>

  <div class="flex justify-around">
    <div class="w-2/5 rounded ring ring-amber-400 p-3">
      <Field label="gains needed">{{ itemGoal - itemCurrent }}</Field>
      <Field label="expected actual (lol) gains">{{ gains }}</Field>
    </div>
  </div>

</template>

<script>
import { computed } from '@vue/reactivity';
import { useLocalStorage } from '@vueuse/core';
import { watchEffect, ref } from 'vue';
import dateDiff from '@/composables/dateDiff.js';
import areaItems from '@/../public/data/areaItems.json';

export default {
  setup() {
    const images = {
      'coin': 'coin',
      'vcoin': 'virtual_coin',
      'music card': 'Song_card',
      'stamp voucher': 'Stamp_exchange_ticket',

      /*'cool charm': 'Cool_piece',
      'cute charm': 'Cute_piece',
      'happy charm': 'Happy_piece',
      'mysterious charm': 'Mysterious_piece',
      'pure charm': 'Pure_piece',

      'cool gem': 'Cool_gem',
      'cute gem': 'Cute_gem',
      'happy gem': 'Happy_gem',
      'mysterious gem': 'Mysterious_gem',
      'pure gem': 'Pure_gem',*/

      'miracle gem': 'Miracle_gem',

      'cloth': 'Magic_cloth',
      'thread': 'Magic_thread',
      'seed': 'Mysterious_seed'
    }

    const showDecoCalc = useLocalStorage('showDecoCalc',false);
    const decoration = useLocalStorage('decoration','plant');
    const startLevel = useLocalStorage('decoStartLevel',1);
    const endLevel = useLocalStorage('decoEndLevel',1);

    const decoCoins = computed(() => {
      let total = 0;
      for (let i = startLevel.value + 1; i <= endLevel.value; i++){
        total += areaItems[decoration.value][i].coins;
      }
      return total;
    });

    const decoCharms = computed(() => {
      if (decoration.value == 'plant') { return; }
      let total = 0;
      for (let i = startLevel.value + 1; i <= endLevel.value; i++){
        total += areaItems[decoration.value][i].charms;
      }
      return total;
    });

    const decoGems = computed(() => {
      if (decoration.value == 'plant') { return; }
      let total = 0;
      for (let i = startLevel.value + 1; i <= endLevel.value; i++){
        total += areaItems[decoration.value][i].gems;
      }
      return total;
    });

    const decoSeeds = computed(() => {
      if (decoration.value != 'plant') { return; }
      let total = 0;
      for (let i = startLevel.value + 1; i <= endLevel.value; i++){
        total += areaItems[decoration.value][i].seeds;
      }
      return total;
    });

    watchEffect(() => {
      if (startLevel.value > endLevel.value){
        endLevel.value = startLevel.value;
      }
    });

    const itemSelected = useLocalStorage('itemSelected','coin');
    const itemGoal = useLocalStorage('itemGoal',0);
    const itemCurrent = useLocalStorage('itemCurrent',0);
    const itemDeadline = useLocalStorage('itemDeadline','2022-09-18');

    const baseNums = ref({});
    const multipliers = ref({});
    const values = ref({});
    const includeVal = useLocalStorage('itemIncludeVal',{
      'eventShop': true,
      'dailyCL': true,
      'weeklyCL': false
    });

    watchEffect(() => {
      baseNums.value['dailyCL'] = 0;
      baseNums.value['weeklyCL'] = 0;

      switch (itemSelected.value) {
        case 'coin':
          baseNums.value['eventShop'] = 10000;
          baseNums.value['dailyCL'] = 10000;
          baseNums.value['weeklyCL'] = 100000;
          break;
        case 'virtual_coin':
          baseNums.value['eventShop'] = 1500;
          break;
        case 'Song_card':
          baseNums.value['eventShop'] = 10;
          baseNums.value['weeklyCL'] = 10;
          break;
        case 'Stamp_exchange_ticket':
          baseNums.value['eventShop'] = 1;
          break;
        case 'Magic_cloth':
          baseNums.value['eventShop'] = 300;
          baseNums.value['dailyCL'] = 10;
          baseNums.value['weeklyCL'] = 150;
          break;
        case 'Magic_thread':
          baseNums.value['eventShop'] = 30;
          baseNums.value['dailyCL'] = 2;
          baseNums.value['weeklyCL'] = 15;
          break;
        case 'Mysterious_seed':
          baseNums.value['eventShop'] = 10;
          baseNums.value['dailyCL'] = 2;
          baseNums.value['weeklyCL'] = 10;
          break;
        case 'Miracle_gem':
          baseNums.value['eventShop'] = 100;
          baseNums.value['dailyCL'] = 10;
          baseNums.value['weeklyCL'] = 50;
          break;
        case 'Cool_piece':
        case 'Cute_piece':
        case 'Happy_piece':
        case 'Mysterious_piece':
        case 'Pure_piece':
          baseNums.value['eventShop'] = 250;
          break;
        default:
          baseNums.value['eventShop'] = 50;
      }
    });

    const timeRemaining = computed(() => {
      var itemDeadlineDateObj = new Date(new Date(itemDeadline.value).setUTCHours(23,59,59));
      return dateDiff(new Date(), new Date(itemDeadlineDateObj.getTime() - itemDeadlineDateObj.getTimezoneOffset() * -60000));
    });

    watchEffect(() => {
      multipliers.value['eventShop'] = Math.floor(timeRemaining.value.days / 9);
      multipliers.value['dailyCL'] = timeRemaining.value.days;
      multipliers.value['weeklyCL'] = Math.floor(timeRemaining.value.days / 7);
    });

    watchEffect(() => {
      values.value['eventShop'] = baseNums.value['eventShop'] * multipliers.value['eventShop'];
      values.value['dailyCL'] = baseNums.value['dailyCL'] * multipliers.value['dailyCL'];
      values.value['weeklyCL'] = baseNums.value['weeklyCL'] * multipliers.value['weeklyCL'];
    });

    const gains = computed(() => {
      let total = 0;
      for (let prop in includeVal.value){
        if (includeVal.value[prop]){
          total += values.value[prop];
        }
      }
      return total;
    });

    return {
      showDecoCalc, decoration, startLevel, endLevel,
      decoCoins, decoCharms, decoGems, decoSeeds,
      images, itemSelected, itemGoal, itemCurrent,
      itemDeadline, timeRemaining,
      baseNums, multipliers, values, includeVal,
      gains
    }
  }
}
</script>