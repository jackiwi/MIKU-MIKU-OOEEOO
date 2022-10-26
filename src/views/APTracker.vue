<template>
  <div class="w-full flex justify-start sticky top-4 z-20 mb-2 gap-2">
    <p class="px-2 py-0 rounded-lg text-amber-600 font-semibold bg-amber-300
        flex justify-center outline outline-2 outline-amber-400 border-4 border-amber-50">
      {{ songDifficulty }} {{ trackerMode.toUpperCase() }}s
    </p>
    <button @click="showFilter = !showFilter; showSongRecords = false;"
        class="p-0 w-8 h-8 flex justify-center outline outline-2 outline-amber-400 border-4 border-amber-50">
      <FunnelIcon class="w-4 h-4 mt-1 text-amber-600"></FunnelIcon>
    </button>
    <button v-if="isLogin" @click="showSubmitModal = !showSubmitModal; showSongRecords = false;"
        class="p-0 w-8 h-8 flex justify-center outline outline-2 outline-amber-400 border-4 border-amber-50">
      <PlusCircleIcon class="w-5 h-5 mt-0.5 text-amber-600"></PlusCircleIcon>
    </button>
  </div>
  <div class="archive-box-x-mark"></div>

  <div v-if="showFilter" class="w-full flex justify-center">
    <SongFilter
      :searchTerm="searchTerm" :focusUnit="focusUnit" :sortType="sortType" :sortOrder="sortOrder"
      :songDifficulty="songDifficulty" :trackerMode="trackerMode"
      @close="showFilter = false;"
      @updateSongList="updateSongList"></SongFilter>
  </div>

  <div v-if="showSubmitModal" class="w-full flex justify-center">
    <SubmitRecordModal
      @close="showSubmitModal = false;"
      @submitRec="submitRec"></SubmitRecordModal>
  </div>

  <div class="sm:flex sm:gap-4">
    <div class="sm:min-w-[40%] sm:max-w-[40%]">
      <div v-if="initLoad">
        <SongList
            :songListAll="songList"
            :key1="showFilter" :key2="showSubmitModal"
            :songDifficulty="songDifficulty"
            :trackerMode="trackerMode"
            @getSongAndRecords="getSongAndRecords"></SongList>
      </div>
    </div>

    <div v-if="showSongRecords"
      class="sticky top-0 z-[100]">
      <SongRecords 
        :song="currentSong"
        :songRecords="songRecords"
        :songNotes="songNotes"
        :songDifficulty="songDifficulty"
        @close="showSongRecords = false;"
        @deleteRecord="deleteRec"></SongRecords>
    </div>
  </div>


</template>

<script>
import SongList from '@/components/APTracker/SongList.vue';
import SongRecords from '@/components/APTracker/SongRecords.vue';
import SubmitRecordModal from '@/components/APTracker/SubmitRecordModal.vue';
import SongFilter from '@/components/APTracker/SongFilter.vue';
import { getAllSongsFiltered, getAllSongsFiltered1 } from '@/composables/getAllSongsFiltered.js';
import { submitRecord } from '@/composables/submitRecord.js';
import { deleteRecord } from '@/composables/deleteRecord.js';
import { useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useAuth, getSongRecords, getSongNotes } from '@/firebase.js';
import { FunnelIcon, PlusCircleIcon } from '@heroicons/vue/20/solid';

export default {
  components: { 
    SongList, SubmitRecordModal, SongFilter, SongRecords,
    FunnelIcon, PlusCircleIcon
  },
  setup(){
    const { user, isLogin } = useAuth();
    const initLoad = ref(true);

    const showSongRecords = ref(false);
    const currentSong = ref(null);
    const songRecords = ref(null);
    const songNotes = ref(null);

    const getSongAndRecords = (async (song) => {
      if (!showSongRecords.value || currentSong.value != song){
        songRecords.value = await getSongRecords(user.value?.uid, song.ID, songDifficulty.value);
        songNotes.value = await getSongNotes(user.value?.uid, song.ID);
        currentSong.value = song;
        showSongRecords.value = true;
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
          'sortType':sortType.value == 'song lv' ? songDifficulty.value + " difficulty" : sortType.value,
          'sortOrder':sortOrder.value,
          'songDifficulty':songDifficulty.value
        }, user.value?.uid, trackerMode.value);
      }
      initLoad.value = true;
    });

    const showSubmitModal = ref(false);

    const showFilter = ref(false);
    const searchTerm = useLocalStorage('songSearchTerm','');
    const focusUnit = useLocalStorage('songFocusUnit',["VIRTUAL SINGER", "Leo/need", "MORE MORE JUMP!", "Vivid BAD SQUAD", "Wonderlands×Showtime", "25-ji, Nightcord de.", "Other"]);
    const sortType = useLocalStorage('songSortType','ID');
    const sortOrder = useLocalStorage('songSortOrder','asc');
    const songDifficulty = useLocalStorage('songDifficulty','Master');
    const trackerMode = useLocalStorage('trackerMode','ap');
    
    const songList = ref(getAllSongsFiltered({
          'searchTerm':searchTerm.value,
          'focusUnit':focusUnit.value,
          'sortType':sortType.value == 'song lv' ? songDifficulty.value + " difficulty" : sortType.value,
          'sortOrder':sortOrder.value,
          'songDifficulty':songDifficulty.value
        }));

    const updateSongList = async (searchTerm0, focusUnit0, sortType0, sortOrder0, songDifficulty0, trackerMode0) => {
      showFilter.value = false;
      initLoad.value = false;
      searchTerm.value = searchTerm0.value;
      focusUnit.value = focusUnit0.value;
      songDifficulty.value = songDifficulty0.value;
      sortType.value = sortType0.value;
      sortOrder.value = sortOrder0.value;
      trackerMode.value = trackerMode0.value;
      var filter = {
        'searchTerm':searchTerm0.value,
        'focusUnit':focusUnit0.value,
        'sortType': sortType0.value == 'song lv' ? songDifficulty0.value + " difficulty" : sortType0.value,
        'sortOrder':sortOrder0.value,
        'songDifficulty':songDifficulty0.value
      };
      songList.value = await getAllSongsFiltered1(filter, user.value?.uid, trackerMode.value);
      initLoad.value = true;
    };

    const submitRec = async (newRecord) => {
      showSubmitModal.value = false;
      initLoad.value = false;
      await submitRecord(user.value.uid, newRecord.value);
      songList.value = await getAllSongsFiltered1({
          'searchTerm':searchTerm.value,
          'focusUnit':focusUnit.value,
          'sortType':sortType.value == 'song lv' ? songDifficulty.value + " difficulty" : sortType.value,
          'sortOrder':sortOrder.value,
          'songDifficulty':songDifficulty.value
        }, user.value?.uid, trackerMode.value);
      initLoad.value = true;
    };

    const deleteRec = async (oldRecord) => {
      initLoad.value = false;
      showSongRecords.value = false;
      await deleteRecord(user.value.uid, oldRecord);
      songList.value = await getAllSongsFiltered1({
          'searchTerm':searchTerm.value,
          'focusUnit':focusUnit.value,
          'sortType':sortType.value == 'song lv' ? songDifficulty.value + " difficulty" : sortType.value,
          'sortOrder':sortOrder.value,
          'songDifficulty':songDifficulty.value
        }, user.value?.uid, trackerMode.value);
      showSongRecords.value = true;
      initLoad.value = true;
    }

    return {
      showFilter, searchTerm, focusUnit, sortType, sortOrder, songDifficulty, trackerMode,
      user, isLogin, initLoad,
      songList, updateSongList, showSubmitModal, submitRec, deleteRec,
      getSongAndRecords, showSongRecords, currentSong, songRecords, songNotes
    };
  }
}
</script>