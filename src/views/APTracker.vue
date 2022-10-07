<template>
  <SubmitRecordModal></SubmitRecordModal>

  <div class="w-full flex justify-end sticky top-4 z-20">
    <button @click="showFilter = !showFilter" class="p-1 w-8 h-8 flex justify-center outline outline-2 outline-amber-400 border-4 border-amber-50">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-amber-600">
        <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <div v-if="showFilter" class="w-full flex justify-center">
    <SongFilter
      :searchTerm="searchTerm" :focusUnit="focusUnit" :sortType="sortType" :sortOrder="sortOrder"
      @close="showFilter = false" @updateSongList="updateSongList"></SongFilter>
  </div>

  <div v-if="isLogin" class="sm:max-w-[55%]">
    <SongList :songListAll="songList" :key="showFilter" :userUID="user.uid" :bestRecords="bestRecords"></SongList>
  </div>

</template>

<script>
import SongList from '@/components/APTracker/SongList.vue';
import SubmitRecordModal from '@/components/APTracker/SubmitRecordModal.vue';
import SongFilter from '@/components/APTracker/SongFilter.vue';
import getAllSongsFiltered from '@/composables/getAllSongsFiltered.js';
import { useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useAuth, getBestRecordsDB } from '@/firebase.js';

export default {
  components: { SongList, SubmitRecordModal, SongFilter },
  setup(){
    const { user, isLogin } = useAuth();
    const bestRecords = ref([]);

    watch(user, async () => {
      if (user && user.value.uid){
        bestRecords.value = await getBestRecordsDB(user.value.uid);
      }
    });

    const showFilter = ref(false);
    const searchTerm = useLocalStorage('songSearchTerm','');
    const focusUnit = useLocalStorage('songFocusUnit',["VIRTUAL SINGER", "Leo/need", "MORE MORE JUMP!", "Vivid BAD SQUAD", "Wonderlands×Showtime", "25-ji, Nightcord de.", "Other"]);
    const sortType = useLocalStorage('songSortType','');
    const sortOrder = useLocalStorage('songSortOrder','asc');
    
    const songList = ref(getAllSongsFiltered({
        'searchTerm':searchTerm.value,
        'focusUnit':focusUnit.value,
        'sortType':sortType.value,
        'sortOrder':sortOrder.value
      }));

    const updateSongList = (searchTerm0, focusUnit0, sortType0, sortOrder0) => {
      showFilter.value = false;
      searchTerm.value = searchTerm0.value;
      focusUnit.value = focusUnit0.value;
      sortType.value = sortType0.value;
      sortOrder.value = sortOrder0.value;
      var filter = {
        'searchTerm':searchTerm0.value,
        'focusUnit':focusUnit0.value,
        'sortType':sortType0.value,
        'sortOrder':sortOrder0.value
      };
      songList.value = getAllSongsFiltered(filter);
    };

    return {
      showFilter, searchTerm, focusUnit, sortType, sortOrder,
      songList, updateSongList, user, isLogin, bestRecords
    };
  }
}
</script>