<template>
  <div class="h-full w-full fixed top-0 left-0 z-20 bg-zinc-500 opacity-40" @click="hide"></div>

  <div class="box-light modal max-h-[95%] sm:w-[70%] z-30 p-2">
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

    <Field label="mode">
      <div>
        <button v-for="key in ['fc','ap']"
            :key="key" class="mr-1 mb-1" @click="trackerMode0 = key"
            :class="{ 'opacity-25': trackerMode0 !== key }">
          {{ key }}
        </button>
      </div>
    </Field>

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
          <button v-for="(value,key) in
              {'default': 'ID', 'release': 'Release date', 'song lv.': 'song lv', 'title': 'Song title',
              'nonperfs': 'nonperfs', 'combo breaks': 'combo breaks'}"
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

    <div class="flex justify-evenly">
      <div class="w-4/5">
        
        <Field class="" label="no PL only">
          <input type="checkbox" v-model="hidePL0" />
        </Field>
        
        <Field :label="trackerMode0 == 'ap' ? 'APs?' : 'FCs?'">
          <div>
            <button v-for="(value,key) in {'hide ap/fc': 'hide', 'show only ap/fc': 'show', 'x': 'x'}"
                :key="key" @click="hideShowGoal0 = value" class="mr-1 mb-1"
                :class="{ 'opacity-25': hideShowGoal0 !== value }">
              {{ key }}
            </button>
          </div>
        </Field>

        <Field label="songs with no record?">
          <div>
            <button v-for="(value,key) in {'hide no-records': 'hide', 'show only no-records': 'show', 'x': 'x'}"
                :key="key" @click="hideShowNoRec0 = value" class="mr-1 mb-1"
                :class="{ 'opacity-25': hideShowNoRec0 !== value }">
              {{ key }}
            </button>
          </div>
        </Field>

      </div>
    </div>

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

  props: [
    'searchTerm', 'focusUnit', 'sortType', 'sortOrder',
    'songDifficulty', 'trackerMode',
    'hidePL', 'hideShowGoal', 'hideShowNoRec'
  ],

  setup(props, { emit }){
    const searchTerm0 = ref(props.searchTerm);
    const focusUnit0 = ref(props.focusUnit);
    const sortType0 = ref(props.sortType);
    const sortOrder0 = ref(props.sortOrder);
    const songDifficulty0 = ref(props.songDifficulty);
    const trackerMode0 = ref(props.trackerMode);
    const hidePL0 = ref(props.hidePL);
    const hideShowGoal0 = ref(props.hideShowGoal);
    const hideShowNoRec0 = ref(props.hideShowNoRec);

    const emitFilter = () => {
      emit('updateSongList',
        searchTerm0, focusUnit0, sortType0, sortOrder0,
        songDifficulty0, trackerMode0,
        hidePL0, hideShowGoal0, hideShowNoRec0);
    }

    return {
      emitFilter,
      searchTerm0, focusUnit0, sortType0, sortOrder0,
      songDifficulty0, trackerMode0,
      hidePL0, hideShowGoal0, hideShowNoRec0
    };
  }
}
</script>