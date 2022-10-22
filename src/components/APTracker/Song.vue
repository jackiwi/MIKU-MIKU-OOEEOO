<template>
  <div class="outline flex gap-4 content-center p-4 relative">

    <div v-if="noPL && bestRecord && bestRecord.nonperfs == 0" class="ribbon ribbon-tr">
      <span class="bg-amber-400">no PL!</span>
    </div>

    <div class="flex flex-col absolute top-1 left-1 sm:m-0 sm:static sm:place-content-center">
      <div class="rounded-full bg-amber-300 shadow outline outline-1 sm:outline-2 outline-amber-600 w-8 h-8 sm:w-12 sm:h-12 p-1 sm:p-0 flex flex-col place-content-center">
        <p class="text-amber-600">
          {{ song[songDifficulty + " difficulty"] }}
        </p>
      </div>
    </div>

    <div class="flex flex-col place-content-center">
      <img :src="`https://${song['Jacket art']}`"
        class="max-w-24 max-h-24" />
    </div>

    <div class="flex flex-col place-content-center text-left grow">
      <h3>{{ song['Song title'] }}</h3>
      <div class="flex gap-4">
        <div>
          <p class="ml-3 mt-2">{{ nonperfs }}</p>
          <p class="ml-3 mt-1 text-zinc-400 font-thin text-sm">{{ date }}</p>
        </div>
        <div class="flex flex-col place-content-center">
          <a v-if="imgLink" :href="imgLink" target="_blank">
            <PhotoIcon class="w-8 h-8"></PhotoIcon>
          </a>
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-end">
      <Bars3Icon @click="emitSong" class="cursor-pointer w-6 h-6"></Bars3Icon>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue';
import { PhotoIcon, Bars3Icon } from '@heroicons/vue/24/outline';

export default {
  props: [ 'song', 'songDifficulty', 'bestRecord' ],
  components: { PhotoIcon, Bars3Icon },
  setup(props, { emit }){
    const emitSong = (() => {
      emit('emitSong',props.song);
    });

    const nonperfs = ref('no record');
    const date = ref('');
    const noPL = ref(false);
    const imgLink = ref(null);

    if(props.bestRecord){
      if(props.bestRecord.nonperfs == 0){
        nonperfs.value = "All perfect!";
      }
      else{
        nonperfs.value = "nonperf record: -" + props.bestRecord.nonperfs;
      }
      date.value = props.bestRecord.date;
      noPL.value = props.bestRecord.noPL;
      imgLink.value = props.bestRecord.imageLink;
    }

    return { nonperfs, date, noPL, imgLink, emitSong };
  }
}
</script>