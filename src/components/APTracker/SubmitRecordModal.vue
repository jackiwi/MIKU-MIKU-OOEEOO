<template>
  <div class="h-full w-full fixed top-0 left-0 z-20 bg-zinc-500 opacity-40" @click="hide"></div>

  <div class="max-w-xs sm:max-w-[65%] max-h-[95%] overflow-y-scroll sm:w-[65%] bg-yellow-200 rounded-lg shadow outline outline-amber-400 border-8 border-amber-50
    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 p-2">

    <div class="px-16">
      <form @submit.prevent="submitRecord">
        <Field label="image link">
          <input v-model="newRecord.imageLink" type="text" />
        </Field>

        <Field label="song">
          <div>
            <select class="w-4/5 truncate" v-model="newRecord.songID" required>
              <option
                v-for="song in songListSorted" :key="song.ID" :value="parseInt(song.ID)">
                {{ song['Song title'] }}
              </option>
            </select>
          </div>
        </Field>

        <Field label="difficulty">
          <div>
            <button
              v-for="(key) in [ 'easy','normal','hard','expert','master' ]"
              :key="key"
              class="mr-1 mb-1"
              :class="{ 'opacity-25': newRecord.difficulty !== key }"
              @click.prevent="newRecord.difficulty = key">
              {{ key }}
            </button>
          </div>
        </Field>

        <Field label="date">
          <input v-model="newRecord.date" type="date" required />
        </Field>
        
        <Field label="great">
          <input v-model="newRecord.great" type="number" required />
        </Field>
        <Field label="good">
          <input v-model="newRecord.good" type="number" required />
        </Field>
        <Field label="bad">
          <input v-model="newRecord.bad" type="number" required />
        </Field>
        <Field label="miss">
          <input v-model="newRecord.miss" type="number" required />
        </Field>

        <Field label="no PL?">
          <input v-model="newRecord.noPL" type="checkbox" />
        </Field>

        <input type="submit" value="submit" class="cursor-pointer" />
      </form>

    </div>

  </div>

</template>

<script>
import Field from '@/components/Field.vue';
import { useAuth } from '@/firebase.js';
import songList from '@/../public/data/songs.json';
import { ref } from 'vue';

export default {
  components: { Field },

  emits: ['close', 'submitRec'],

  setup(props, { emit }){
    const { user } = useAuth();

    const hide = () => {
      emit('close');
    }

    const newRecord = ref({
      imageLink: '',
      songID: null,
      difficulty: 'master',
      date: new Date(Date.now()).toISOString().substring(0,10),
      nonperfs: 0,
      great: 0,
      good: 0,
      bad: 0,
      miss: 0,
      noPL: false
    })

    const submitRecord = async () => {
      newRecord.value.nonperfs = (newRecord.value.great + newRecord.value.good + newRecord.value.bad + newRecord.value.miss);
      emit('submitRec', newRecord);
    }

    const songListSorted = ref(songList.sort((a,b) => {
      let aTitle = a['Song title'].toLowerCase();
      let bTitle = b['Song title'].toLowerCase();
      if (aTitle < bTitle){
        return -1;
      }
      if (aTitle > bTitle){
        return 1;
      }
      return 0;
    }));

    return {
      submitRecord, songListSorted, user, hide,
      newRecord
    };
  }
}
</script>