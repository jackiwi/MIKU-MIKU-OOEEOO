<template>
  <div class="h-full w-full fixed top-0 left-0 z-20 bg-zinc-500 opacity-40" @click="hide"></div>

  <div class="max-h-[95%] overflow-y-scroll sm:w-[70%] bg-yellow-200 rounded-lg shadow outline outline-amber-400 border-8 border-amber-50
    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 p-2">
    <Field label="search term">
      <input class="py-1" type="text" placeholder="search term..." v-model="searchTerm0" />
    </Field>

    <div class="py-1">
      <CheckBoxList :items="{
        'VS': 'VIRTUAL SINGER',
        'L/N': 'Leo/need',
        'MMJ': 'MORE MORE JUMP!',
        'VBS': 'Vivid BAD SQUAD',
        'W×S': 'Wonderlands×Showtime',
        '25ji': '25-ji, Nightcord de.',
        'Other': 'Other'}"
        :modelVal="focusUnit0"
        modelValName="focusUnit0"
        @updateCheckBoxList="updateCheckBoxList">
      </CheckBoxList>
    </div>

    <Field label="difficulty">
      <div>
        <button v-for="(value,key) in {'easy': 'Easy', 'normal': 'Normal', 'hard': 'Hard', 'expert': 'Expert', 'master': 'Master'}"
            :key="key" @click="songDifficulty0 = value" class="mr-1 mb-1"
            :class="{ 'opacity-25': songDifficulty0 !== value }">
          {{ key }}
        </button>
      </div>
    </Field>

    <Field label="sort by">
      <div class="flex flex-col justify-evenly">
        <div>
          <button v-for="(value,key) in {'default': 'ID', 'release': 'Release date', 'song lv.': 'song lv', 'title': 'Song title', 'nonperfs': 'nonperfs'}"
              :key="key" @click="sortType0 = value" class="mr-1 mb-1"
              :class="{ 'opacity-25': sortType0 !== value }">
            {{ key }}
          </button>
        </div>
        <div>
          <button v-for="(key) in ['asc','desc']"
            :key="key" @click="sortOrder0 = key" class="mr-1 mb-1"
            :class="{ 'opacity-25': sortOrder0 !== key }">
            {{ key }}
          </button>
        </div>
      </div>
    </Field>

    <Field label="no PL only">
      <input type="checkbox" />
    </Field>

    <Field label="hide APs">
      <input type="checkbox" />
    </Field>

    <Field label="hide songs with no record">
      <input type="checkbox" />
    </Field>

    <button class="my-4 text-2xl font-bold px-6 py-2" @click="emitFilter">apply</button>  
  </div>

</template>

<script>
import Field from '@/components/Field.vue';
import CheckBoxList from '@/components/CheckBoxList.vue';
import { ref } from 'vue';

export default {
  components: { Field, CheckBoxList },

  emits: ['updateSongList','close'],

  methods: {
    updateCheckBoxList(modelVal, modelValName){
      this[modelValName] = modelVal;
    },
    hide() {
      this.$emit('close')
    }
  },

  props: [ 'searchTerm', 'focusUnit', 'sortType', 'sortOrder', 'songDifficulty' ],

  setup(props, { emit }){
    const searchTerm0 = ref(props.searchTerm);
    const focusUnit0 = ref(props.focusUnit);
    const sortType0 = ref(props.sortType);
    const sortOrder0 = ref(props.sortOrder);
    const songDifficulty0 = ref(props.songDifficulty);

    const emitFilter = () => {
      emit('updateSongList', searchTerm0, focusUnit0, sortType0, sortOrder0, songDifficulty0);
    }

    return { emitFilter, searchTerm0, focusUnit0, sortType0, sortOrder0, songDifficulty0 };
  }
}
</script>