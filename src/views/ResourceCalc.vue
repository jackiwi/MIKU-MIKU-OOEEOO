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
            {{ rewards.eventShop[itemSelected] }} x {{ multipliers.eventShop }} = {{ values.eventShop }}
            <input type="checkbox" v-model="includeVal.eventShop" />
          </span>
        </div>
      </Field>

      <Field label="daily challenge live">
        <div class="flex flex-col justify-center">
          <span>
            {{ rewards.dailyCL[itemSelected] }} x {{ multipliers.dailyCL }} = {{ values.dailyCL }}
            <input type="checkbox" v-model="includeVal.dailyCL" />
          </span>
        </div>
      </Field>

      <Field label="weekly challenge live">
        <div class="flex flex-col justify-center">
          <span>
            {{ rewards.weeklyCL[itemSelected] }} x {{ multipliers.weeklyCL }} = {{ values.weeklyCL }}
            <input type="checkbox" v-model="includeVal.weeklyCL" />
          </span>
        </div>
      </Field>

      <Field label="monthly show pass">
        <div class="flex flex-col justify-center">
          <span>
            {{ rewards.showPassFree[itemSelected] }} x {{ multipliers.showPassFree }} = {{ values.showPassFree }}
            <input type="checkbox" v-model="includeVal.showPassFree" />
          </span>
        </div>
      </Field>

      <Field label="monthly show pass (premium)">
        <div class="flex flex-col justify-center">
          <span>
            {{ rewards.showPassPremium[itemSelected] }} x {{ multipliers.showPassPremium }} = {{ values.showPassPremium }}
            <input type="checkbox" v-model="includeVal.showPassPremium" />
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
import dateDiff from '@/composables/dateDiff';
import areaItems from '@/../public/data/areaItems.json';
import rewards from '@/../public/data/rewards.json';

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

    const multipliers = ref({});
    const values = ref({});
    const includeVal = useLocalStorage('itemIncludeVal',{
      'eventShop': true,
      'dailyCL': true,
      'weeklyCL': false
    });

    const timeRemaining = computed(() => {
      var itemDeadlineDateObj = new Date(new Date(itemDeadline.value).setUTCHours(23,59,59));
      return dateDiff(new Date(), new Date(itemDeadlineDateObj.getTime() - itemDeadlineDateObj.getTimezoneOffset() * -60000));
    });

    watchEffect(() => {
      multipliers.value['eventShop'] = Math.floor(timeRemaining.value.days / 9);
      multipliers.value['dailyCL'] = timeRemaining.value.days;
      multipliers.value['weeklyCL'] = Math.floor(timeRemaining.value.days / 7);
      multipliers.value['showPassFree'] = Math.floor(timeRemaining.value.days / 30);
      multipliers.value['showPassPremium'] = Math.floor(timeRemaining.value.days / 30);
    });

    watchEffect(() => {
      values.value['eventShop'] = rewards.eventShop[itemSelected.value] * multipliers.value['eventShop'];
      values.value['dailyCL'] = rewards.dailyCL[itemSelected.value] * multipliers.value['dailyCL'];
      values.value['weeklyCL'] = rewards.weeklyCL[itemSelected.value] * multipliers.value['weeklyCL'];
      values.value['showPassFree'] = rewards.showPassFree[itemSelected.value] * multipliers.value['showPassFree'];
      values.value['showPassPremium'] = rewards.showPassPremium[itemSelected.value] * multipliers.value['showPassPremium'];
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
      multipliers, values, includeVal,
      gains, rewards
    }
  }
}
</script>