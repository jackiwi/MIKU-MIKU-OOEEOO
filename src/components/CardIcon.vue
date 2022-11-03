<template>
  <span class="relative">
    <img class="absolute z-10 max-w-7 max-h-7 -left-9 -top-1" :src="attrIcon" />
    <a :href="`https://www.sekaipedia.org/${card['Card name']}`" target="_blank">
      <img class="max-w-12 max-h-12" :key="card.ID" :src="imgSrc" />
    </a>
    <span v-if="card['Support unit']" class="absolute z-50 max-w-5 max-h-5 -right-2 -bottom-2 bg-zinc-400 outline outline-zinc-600 outline-2 rounded-2xl p-1">
      <span class="help">
        <img class="max-w-3 max-h-3 z-10" :src="subUnitImg" />
        <span class="tooltip w-16">{{ subUnit }}</span>
      </span>
    </span>
    <span v-if="!card['Associated event']" class="absolute -bottom-2 right-12">
      <span class="help">
        <QuestionMarkCircleIcon class="w-4 h-4 mb-1 inline-block fill-zinc-600"></QuestionMarkCircleIcon>
        <span class="tooltip w-36">
          {{ card['Status'] }}
        </span> 
      </span>
    </span>
  </span>
</template>

<script>
import { computed } from 'vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid';

export default {
  components: { QuestionMarkCircleIcon },
  props: ['card'],
  setup(props){
    const imgSrc = require('@/assets/chibi/'+ props.card.Character.toLowerCase().replaceAll(' ','_')+'.png');
    const attrIcon = require('@/assets/attribute/Icon_attribute_' + props.card.Attribute.toLowerCase() + '.png');
    const subUnitImg = computed(() => {
      if (props.card["Support unit"]){
        try{
          return require('@/assets/unit/' + props.card["Support unit"].replaceAll(' ','_').replace(/[\/!]/g,'') + '_icon.svg');
        }
        catch(err){
          console.log(props.card["Support unit"].replaceAll(' ','_').replace(/[\/!]/g,''));
        }
      }
    });
    const subUnit = computed(() => {
      switch(props.card["Support unit"].toLowerCase().trim()){
        case "leo/need": return "L/N";
        case "more more jump!": return "MMJ";
        case "vivid bad squad": return "VBS";
        case "wonderlands×showtime": return "WxS";
        default: return "25ji";
      }
    });

    return { imgSrc, attrIcon, subUnitImg, subUnit };
  }
}
</script>