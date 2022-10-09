<template>
  <SubmitRecordModal></SubmitRecordModal>

  <div class="w-full flex justify-start sticky top-4 z-20 mb-2">
    <button @click="showFilter = !showFilter" class="p-1 w-8 h-8 flex justify-center outline outline-2 outline-amber-400 border-4 border-amber-50">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-amber-600">
        <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <div v-if="showFilter" class="w-full flex justify-center">
    <SongFilter
      :searchTerm="searchTerm" :focusUnit="focusUnit" :sortType="sortType" :sortOrder="sortOrder"
      @close="showFilter = false;" @updateSongList="updateSongList"></SongFilter>
  </div>

  <div class="sm:flex sm:gap-8">
    <div class="sm:min-w-[45%] sm:max-w-[45%]">
      <div v-if="initLoad">
        <SongList :songListAll="songList" :key="showFilter" @getSongRecords="getSongRecords"></SongList>
      </div>
    </div>

    <div v-if="showSongRecords"
      class="sticky top-0 z-[100]">
      <SongRecords 
        :song="currentSong"
        @close="showSongRecords = false;"></SongRecords>
    </div>
  </div>


</template>

<script>
import SongList from '@/components/APTracker/SongList.vue';
import SubmitRecordModal from '@/components/APTracker/SubmitRecordModal.vue';
import SongFilter from '@/components/APTracker/SongFilter.vue';
import { getAllSongsFiltered, getAllSongsFiltered1 } from '@/composables/getAllSongsFiltered.js';
import { useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useAuth } from '@/firebase.js';
import SongRecords from '@/components/APTracker/SongRecords.vue';

export default {
  components: { SongList, SubmitRecordModal, SongFilter, SongRecords },
  setup(){
    const { user, isLogin } = useAuth();
    const initLoad = ref(true);

    const showSongRecords = ref(false);
    const currentSong = ref(null);

    const getSongRecords = ((song) => {
      if (!showSongRecords.value || currentSong.value != song){
        showSongRecords.value = true;
        currentSong.value = song;
      }else{
        showSongRecords.value = false;
      }
    });

    watch(user, async () => {
      initLoad.value = false;
      if (user && user.value.uid){
        songList.value = await getAllSongsFiltered1({
          'searchTerm':searchTerm.value,
          'focusUnit':focusUnit.value,
          'sortType':sortType.value,
          'sortOrder':sortOrder.value
        }, user.value?.uid);
      }
      initLoad.value = true;
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

    const updateSongList = async (searchTerm0, focusUnit0, sortType0, sortOrder0) => {
      showFilter.value = false;
      initLoad.value = false;
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
      songList.value = await getAllSongsFiltered1(filter, user.value?.uid);
      initLoad.value = true;
    };

    return {
      showFilter, searchTerm, focusUnit, sortType, sortOrder,
      songList, updateSongList, user, isLogin, initLoad, getSongRecords, showSongRecords, currentSong
    };
  }
}
</script>