<template>
  <div class="grid grid-cols-6 max-w-3xl grow p-3">

    <div class="col-span-6 grid grid-cols-6 outline outline-amber-300 bg-amber-300 rounded-t-3xl">
      <div class="col-span-2 flex justify-center py-4">
        <a :href="`https://www.sekaipedia.org/${event.Event}`" target="_blank">
          <img :src="`https://${event.Logo}`" />
        </a>
      </div>

      <div class="col-span-4 flex flex-col place-content-center p-4 grow">
        <h3>{{event["Event Name"]}}</h3>
      </div>
    </div>

    <div class="col-span-6 grid grid-cols-6 outline outline-amber-300 pt-2">

      <div class="col-span-6 sm:col-span-2 grid grid-cols-6 sm:grid-cols-2">
        <div class="col-span-6 sm:col-span-2 grid grid-cols-6 sm:grid-cols-2 m-2 outline outline-amber-300 rounded">
          <div class="col-span-2 sm:col-span-1 flex place-content-center">
            <div class="flex flex-col place-content-center">
              <img class="max-w-11 max-h-11 ssm:max-w-12 sm:max-h-12" :src="attrIcon" />
            </div>
          </div>
          <div class="col-span-4 sm:col-span-1 flex flex-col place-content-center grow">
            <img v-if="unitFocusImg" class="p-1" :src="unitFocusImg" />
            <span v-else>[mixed unit]</span>
          </div>
        </div>

        <div class="col-span-6 sm:col-span-2 grid grid-cols-6 sm:grid-cols-2 m-2">
          <div class="col-span-3 sm:col-span-1 flex flex-col place-content-evenly outline outline-amber-300 rounded m-1">
            <span>
              {{ event["Start date"].substring(0,10) }}
            </span>
            <span>
              {{ event["End date"].substring(0,10) }}
            </span>
          </div>

          <div class="col-span-3 sm:col-span-1 flex flex-col place-content-center outline outline-amber-300 rounded m-1">
            {{ event["Type"] }}
          </div>
        </div>
      </div>

      <div class="col-span-6 sm:col-span-4 flex flex-col place-content-center sm:h-48">
        <div class="flex flex-col sm:flex-row place-content-center">
          <CharBox class="outline-yellow-300 grow" :cards="eventCards.filter((i) => {return i.Rarity == 4})"></CharBox>
          <span class="flex place-content-center">
            <CharBox class="outline-yellow-500" :cards="eventCards.filter((i) => {return i.Rarity == 3})"></CharBox>
            <CharBox class="outline-yellow-600" :cards="eventCards.filter((i) => {return i.Rarity == 2})"></CharBox>
          </span>
        </div>

        <div class="flex place-content-center grow">
          <CharBox class="outline-amber-400 grow" :cards="otherCards"></CharBox>
        </div>
      </div>
    </div>

  </div>  
</template>

<script>
import { computed } from 'vue';
import CharBox from '@/components/CharBox.vue';

export default {
  components: { CharBox },
  props: ['event', 'eventCards', 'otherCards'],
  setup(props){
    const attrIcon = require('@/assets/attribute/Icon_attribute_' + props.event["Bonus attribute"].toLowerCase() + '.png');
    const unitFocusImg = computed(() => {
      if (props.event["Unit focus"]){
        try{
          return require('@/assets/unit/' + props.event["Unit focus"].replaceAll(' ','_').replace(/[\/!]/g,'') + '_logo.png');
        }
        catch(err){
          return null;
        }
      }
    });

    return { attrIcon, unitFocusImg };
  }
}
</script>