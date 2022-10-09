<template>
  <div class="outline flex gap-4 content-center p-4 relative">

    <div v-if="noPL && bestRecord && bestRecord.nonperfs == 0" class="ribbon ribbon-tr">
      <span class="bg-amber-400">no PL!</span>
    </div>

    <div class="flex flex-col absolute top-1 left-1 sm:m-0 sm:static sm:place-content-center">
      <div class="rounded-full bg-amber-300 shadow outline outline-1 sm:outline-2 outline-amber-600 w-8 h-8 sm:w-12 sm:h-12 p-1 sm:p-0 flex flex-col place-content-center">
        <p class="text-amber-600">
          {{song['Master difficulty']}}
        </p>
      </div>
    </div>

    <div class="flex flex-col place-content-center">
      <img :src="`https://${song['Jacket art']}`"
        class="max-w-24 max-h-24" />
    </div>

    <div class="flex flex-col place-content-center text-left grow">
      <h3>{{song['Song title']}}</h3>
      <div class="flex gap-4">
        <div>
          <p class="ml-3 mt-2">{{ nonperfs }}</p>
          <p class="ml-3 mt-1 text-zinc-400 font-thin text-sm">{{ date }}</p>
        </div>
        <div class="flex flex-col place-content-center">
          <a v-if="imgLink" :href="imgLink" target="_blank">
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-end">
      <svg @click="emitSong" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="cursor-pointer w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: [ 'song', 'bestRecord' ],
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