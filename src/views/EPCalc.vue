<template>
  <h1>so u tryna tier huh</h1>
  
  <Field label="event end" >
    <input type="date" v-model="endDate" />
  </Field>

  <Field label="CC?" tooltip="(adds 9 boosts to daily regen)">
    <input type="checkbox" v-model="isCC" />
  </Field>

  <Field label="EP goal">
    <input class="w-4/5" type="number" v-model="EPgoal" step="100000" />
  </Field>

  <Field label="current EP">
    <input class="w-4/5" type="number" v-model="EPcurrent" step="10000" />
  </Field>

  <Field label="CL gain">
    <input class="w-4/5" type="number" v-model="CLgain" step="1000" />
  </Field>

  <Field label="x0 gain">
    <input class="w-4/5" type="number" v-model="baseGain" step="100" />
  </Field>

  <Field label="# Boosts">
    <div>
      <button v-for="(n,key) in 11" :key="key" @click="numBoosts = key" class="mr-1 mb-1"
        :class="{ 'opacity-25': numBoosts !== key }">
        {{ key }}
      </button>
    </div>
  </Field>


<div class="flex justify-around overscroll-none">
  <div class="w-4/5 sm:ml-32">
    <Field label="time remaining">
      {{ timeRemaining.dateDiffString }}
    </Field>

    <Field label="games needed">
      {{ gamesNeeded }}
    </Field>

    <Field label="boosts needed">
      {{ boostsNeeded }}
    </Field>

    <Field label="natural regen">
      {{ naturalRegen }}
    </Field>

    <Field label="boosts needed">
      {{ additionalBoostsNeeded }}
    </Field>

    <Field label="refills needed">
      {{ refillsNeeded }}
    </Field>

    <Field label="crystals needed">
      {{ crystalsNeeded }}
    </Field>
  </div>
</div>
</template>

<script>
import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import Field from '@/components/Field.vue';
import dateDiff from '@/composables/dateDiff.js';

export default {
  name: 'EPCalc',
  components: { Field },
  setup(){
    const endDate = useLocalStorage('endDate','2022-09-18');
    const isCC = useLocalStorage('isCC',false);
    const EPgoal = useLocalStorage('EPgoal',2000000), EPcurrent = useLocalStorage('EPcurrent',1000000);
    const CLgain = useLocalStorage('CLgain',18000), baseGain = useLocalStorage('baseGain',600);
    const numBoosts = useLocalStorage('numBoosts',2);

    const timeRemaining = computed(() => {
      var endDateObj = new Date(new Date(endDate.value).setUTCHours(23,59,59));
      return dateDiff(new Date(), new Date(endDateObj.getTime() - endDateObj.getTimezoneOffset() * -60000));
    });

    const EPboost = computed(() => {
      switch(numBoosts.value){
        case 0: return 1;
        case 4: return 19;
        case 5: return 23;
        case 6: return 26;
        case 7: return 29;
        case 8: return 31;
        case 9: return 33;
        case 10: return 35;
      }
      return numBoosts.value * 5;
    });

    const gamesNeeded = computed(() => {
      var epDiff = EPgoal.value - (EPcurrent.value + (CLgain.value * timeRemaining.value.days));
      return Math.ceil(epDiff / (EPboost.value * baseGain.value));
    });

    const boostsNeeded = computed(() => {
      return gamesNeeded.value * numBoosts.value;
    });

    const naturalRegen = computed(() => {
      var nats = (timeRemaining.value.days * 24 + timeRemaining.value.hours) * 2 + Math.floor(timeRemaining.value.minutes / 30);
      if (isCC.value){
        nats += timeRemaining.value.days * 9;
      }
      return nats;
    });

    const additionalBoostsNeeded = computed(() => {
      return boostsNeeded.value - naturalRegen.value;
    });

    const refillsNeeded = computed(() => {
      return Math.ceil(additionalBoostsNeeded.value / 5);
    })

    const crystalsNeeded = computed(() => {
      return refillsNeeded.value * 50;
    });

    return { EPgoal, EPcurrent, CLgain, baseGain, endDate, numBoosts, isCC,
    timeRemaining, gamesNeeded, boostsNeeded, naturalRegen, additionalBoostsNeeded, refillsNeeded, crystalsNeeded };
  }
}
</script>