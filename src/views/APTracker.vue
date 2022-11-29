<template>
  <div class="w-full flex sticky top-4 z-20 mb-2 gap-2">
    <p class="px-2 py-0 box-mid
        flex justify-center">
      {{ songDifficulty }} {{ trackerMode.toUpperCase() }}s
    </p>
    <button @click="showFilter = !showFilter; showSongRecords = false;"
        class="group hover:w-fit p-0 w-8 h-8 flex box-mid">
      <FunnelIcon class="w-4 h-4 mt-1 ml-1"></FunnelIcon>
      <span class="hidden px-2 group-hover:block">filter</span>
    </button>
    <button v-if="user" @click="showSubmitModal = !showSubmitModal; showSongRecords = false;"
        class="group p-0 w-8 h-8 hover:w-fit flex box-mid">
      <PlusCircleIcon class="w-5 h-5 mt-0.5 ml-0.5"></PlusCircleIcon>
      <span class="hidden px-2 group-hover:block">add a new record</span>
    </button>
  </div>

  <div v-if="showFilter" class="w-full flex justify-center">
    <SongFilter
      :searchTerm="searchTerm" :focusUnit="focusUnit" :sortType="sortType" :sortOrder="sortOrder"
      :songDifficulty="songDifficulty" :trackerMode="trackerMode"
      :hideNoRecord="hideNoRecord" :hideComplete="hideComplete" :hidePL="hidePL"
      @close="showFilter = false;"
      @updateSongList="updateSongList">
    </SongFilter>
  </div>

  <div v-if="showSubmitModal" class="w-full flex justify-center">
    <SubmitRecordModal
      :user="user"
      @close="showSubmitModal = false;"
      @submitRec="submitRec">
    </SubmitRecordModal>
  </div>

  <div class="sm:flex sm:gap-4">
    <div class="sm:min-w-[40%] sm:max-w-[40%]">
      <div v-if="!isLoading">
        <SongList
            :songListAll="songList"
            :key1="showFilter" :key2="showSubmitModal"
            :songDifficulty="songDifficulty"
            :trackerMode="trackerMode"
            @getSongAndRecords="getSongAndRecords"></SongList>
      </div>
      <div v-else class="flex justify-center pt-2">
        <ArrowPathIcon class="animate-spin w-6 h-6 text-amber-300"></ArrowPathIcon>
      </div>
    </div>

    <div v-if="showSongRecords"
      class="sticky top-0 z-[100]">
      <SongRecords 
        :song="currentSong"
        :songRecords="songRecords"
        :songNotes="songNotes"
        :songDifficulty="songDifficulty"
        :user="user"
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

import { useAuth, getAllRecordsDB, getAllNotesDB } from '@/firebase.js';
import { getAllSongsFiltered, getAllSongsFiltered1 } from '@/composables/getAllSongsFiltered.js';
import { getSongRecords, getSongNotes } from '@/composables/getUserSongDetails.js';
import { submitRecord } from '@/composables/submitRecord.js';
import { deleteRecord } from '@/composables/deleteRecord.js';

import { useLocalStorage, useSessionStorage } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import { FunnelIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/vue/20/solid';

export default {
  components: { 
    SongList, SubmitRecordModal, SongFilter, SongRecords,
    FunnelIcon, PlusCircleIcon, ArrowPathIcon
  },
  setup(){
    const { user } = useAuth();

    const songRecordsDB = useSessionStorage('songRecordsDB', []);
    const songNotesDB = useSessionStorage('songNotesDB', []);

    const isLoading = ref(false);

    const showSongRecords = ref(false);
    const currentSong = ref(null);
    const songRecords = ref(null), songNotes = ref(null);

    onMounted(() => {
      isLoading.value = true;
    });

    const getSongAndRecords = (async (song) => {
      if (!showSongRecords.value || currentSong.value != song){
        songRecords.value = getSongRecords(songRecordsDB.value, song.ID, songDifficulty.value);
        songNotes.value = getSongNotes(songNotesDB.value, song.ID);
        currentSong.value = song;
        showSongRecords.value = true;
      }else{
        showSongRecords.value = false;
      }
    });

    watch(user, async () => {
      isLoading.value = true;
      if (user && user.value.uid){
        if (!songRecordsDB.value || songRecordsDB.value.length == 0){
          songRecordsDB.value = await getAllRecordsDB(user.value.uid);
          songNotesDB.value = await getAllNotesDB(user.value.uid);
        }
        updateSongListValue();
      }
      isLoading.value = false;
    });

    const showSubmitModal = ref(false);

    const showFilter = ref(false);
    const searchTerm = useLocalStorage('songSearchTerm','');
    const focusUnit = useLocalStorage('songFocusUnit',["VIRTUAL SINGER", "Leo/need", "MORE MORE JUMP!", "Vivid BAD SQUAD", "Wonderlands×Showtime", "25-ji, Nightcord de.", "Other"]);
    const sortType = useLocalStorage('songSortType','ID');
    const sortOrder = useLocalStorage('songSortOrder','asc');
    const songDifficulty = useLocalStorage('songDifficulty','Master');
    const trackerMode = useLocalStorage('trackerMode','ap');
    const hideNoRecord = useLocalStorage('hideNoRecord',false);
    const hideComplete = useLocalStorage('hideComplete',false);
    const hidePL = useLocalStorage('hidePL',false);

    const getFilter = () => {
      return {
        'searchTerm':searchTerm.value,
        'focusUnit':focusUnit.value,
        'sortType': sortType.value == 'song lv' ? songDifficulty.value + " difficulty" : sortType.value,
        'sortOrder':sortOrder.value,
        'songDifficulty':songDifficulty.value,
        'noPL':hidePL.value
      }
    }

    const applyPostFilter = (i) => {
      if (hideNoRecord.value && !i.bestRecord){
        return false;
      }
      if (hideComplete.value && i.bestRecord){
        let breaks = i.bestRecord.good + i.bestRecord.bad + i.bestRecord.miss;
        if (trackerMode.value == 'ap'){
          breaks += i.bestRecord.great;
        }
        return breaks;
      }
      return true;
    }
    
    const songList = ref(getAllSongsFiltered(getFilter()));

    const updateSongListValue = async (updatedRecords = null) => {
      if (updatedRecords){
        let removeAttrRecords = updatedRecords.filter(i => { return i.removeAttrID; });
        removeAttrRecords.forEach(i => {
          //find id in songRecordsDB, remove attr
          let updateRec = songRecordsDB.value.filter(j => { return j.id == i.removeAttrID; })[0];
          if (updateRec) { updateRec[i.attr] = false; }
        });

        let addAttrRecords = updatedRecords.filter(i => { return i.addAttrID; });
        addAttrRecords.forEach(i => {
          let updateRec = songRecordsDB.value.filter(j => { return j.id == i.addAttrID; })[0];
          if (updateRec) { updateRec[i.attr] = true; }
        });

        let newRecords = updatedRecords.filter(i => { return i.newRecord; });
        newRecords.forEach(i => {
          songRecordsDB.value.push(i.newRecord);
        });

        let deletedRecords = updatedRecords.filter(i => { return i.deletedRecordID; });
        deletedRecords.forEach(i => {
          let deletedRec = songRecordsDB.value.filter(j => { return j.id == i.deletedRecordID; })[0];
          songRecordsDB.value.splice( songRecordsDB.value.indexOf(deletedRec), 1 );
        });
      }
      songList.value = (getAllSongsFiltered1(getFilter(), user.value?.uid, trackerMode.value, songRecordsDB.value))
        .filter(i => applyPostFilter(i));
    }

    const updateSongList = async (searchTerm0, focusUnit0, sortType0, sortOrder0, songDifficulty0, trackerMode0, hideNoRecord0, hideComplete0, hidePL0) => {
      showFilter.value = false;
      isLoading.value = true;

      searchTerm.value = searchTerm0.value;
      focusUnit.value = focusUnit0.value;
      songDifficulty.value = songDifficulty0.value;
      sortType.value = sortType0.value;
      sortOrder.value = sortOrder0.value;
      trackerMode.value = trackerMode0.value;
      hideNoRecord.value = hideNoRecord0.value;
      hideComplete.value = hideComplete0.value;
      hidePL.value = hidePL0.value;

      await updateSongListValue();

      isLoading.value = false;
    };

    const submitRec = async (newRecord) => {
      showSubmitModal.value = false;
      isLoading.value = true;
      let updatedRecords = await submitRecord(user.value.uid, newRecord.value, songRecordsDB.value);
      updateSongListValue(updatedRecords);
      isLoading.value = false;
    };

    const deleteRec = async (oldRecord) => {
      isLoading.value = true;
      showSongRecords.value = false;
      let updatedRecords = await deleteRecord(user.value.uid, oldRecord, songRecordsDB.value);
      updateSongListValue(updatedRecords);
      showSongRecords.value = true;
      isLoading.value = false;
    }

    return {
      showFilter, searchTerm, focusUnit, sortType, sortOrder, songDifficulty, trackerMode,
      hideNoRecord, hideComplete, hidePL,
      user, isLoading,
      songList, updateSongList, showSubmitModal, submitRec, deleteRec,
      getSongAndRecords, showSongRecords, currentSong, songRecords, songNotes
    };
  }
}
</script>