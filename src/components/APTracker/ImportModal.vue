<template>
  <div v-if="isLoading" class="h-full w-full fixed top-0 left-0 z-[1000] opacity-25 bg-zinc-800 cursor-wait"></div>
  <div class="h-full w-full fixed top-0 left-0 z-20 bg-zinc-500 opacity-40"></div>

  <div class="relative box-light modal sm:w-[65%] max-w-xs sm:max-w-[65%] max-h-[95%] z-30 p-2">

    <div class="absolute w-[98%] flex justify-end mb-2">
      <XCircleIcon
      class="w-6 h-6 text-amber-700 cursor-pointer"
      :class="{ 'cursor-not-allowed': isLoading || isImporting }"
      @click="hide"></XCircleIcon>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex justify-center">
        <input class="w-72 z-20" type="file" :key="inputKey" accept=".csv" ref="fileInput" @change="selectedFile" />
      </div>
      <div class="flex justify-center gap-4">
        <div class="flex flex-col gap-2 w-24">
          <span class="font-bold">column headers</span>
          <input type="text" v-model="headers.songID" placeholder="songID" />
          <input type="text" v-model="headers.date" placeholder="date" />
          <input type="text" v-model="headers.difficulty" placeholder="difficulty" />
          <input type="text" v-model="headers.great" placeholder="great" />
          <input type="text" v-model="headers.good" placeholder="good" />
          <input type="text" v-model="headers.bad" placeholder="bad" />
          <input type="text" v-model="headers.miss" placeholder="miss" />
          <input type="text" v-model="headers.imageLink" placeholder="imageLink" />
          <input type="text" v-model="headers.noPL" placeholder="noPL" />
        </div>
        <div class="flex flex-col gap-2 max-w-md">
          <div>
            <button v-for="key in ['newBest','willUpdate','allElse']"
                :key="key" class="mr-1 mb-1" @click="dataFilter = key"
                :class="{ 'opacity-25': dataFilter !== key }">
              {{ key }}
            </button>
          </div>
          
          <div v-if="dataFilter == 'willUpdate'">
            <DataTable class="display row-border"
                :columns="[ { data: 'bestAttr' }, ...cols]" :data="recsToUpdate"
                :options="{ ...dt_options, order: [[1, 'asc']], columnDefs:[{visible: false, targets: [3,4,5,6]}] }">
              <thead>
                <tr>
                  <th class="w-1">attr to remove</th>
                  <th class="w-1">song ID</th>
                  <th class="w-1">diff</th>
                  <th class="w-1">bestCB</th>
                  <th class="w-1">bestCB NoPL</th>
                  <th class="w-1">bestPerf</th>
                  <th class="w-1">bestPerf NoPL</th>
                  <th class="w-20">date</th>
                  <th class="w-1">no PL</th>
                  <th class="w-1">gr</th>
                  <th class="w-1">g</th>
                  <th class="w-1">b</th>
                  <th class="w-1">m</th>
                  <th class="w-1">
                    <CameraIcon class="w-5 h-5"></CameraIcon>
                  </th>
                </tr>
              </thead>
            </DataTable>
          </div>
          <div v-else>
            <DataTable class="display row-border"
                :columns="cols" :data="dataFilter == 'newBest' ? newBestRecords : dataFilter == 'willUpdate' ? null : newRecords"
                :options="{...dt_options, order: [[0, 'asc']] }">
              <thead>
                <tr>
                  <th class="w-1">song ID</th>
                  <th class="w-1">diff</th>
                  <th class="w-1">bestCB</th>
                  <th class="w-1">bestCB NoPL</th>
                  <th class="w-1">bestPerf</th>
                  <th class="w-1">bestPerf NoPL</th>
                  <th class="w-20">date</th>
                  <th class="w-1">no PL</th>
                  <th class="w-1">gr</th>
                  <th class="w-1">g</th>
                  <th class="w-1">b</th>
                  <th class="w-1">m</th>
                  <th class="w-1">
                    <CameraIcon class="w-5 h-5"></CameraIcon>
                  </th>
                </tr>
              </thead>
            </DataTable>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-2">
        <button class="w-fit" :class="{ 'animate-spin': isLoading }" @click="startProcessing" :disabled="!validInput && user">
          <span v-if="isLoading">processing...</span>
          <span v-else>process csv</span>
        </button>
        <button class="w-fit" :class="{ 'animate-spin': isImporting }" :disabled="!isProcessed" @click="startImport">import</button>
      </div>
    </div>
  </div>

</template>

<script>
import DataTable from 'datatables.net-vue3';
import { CameraIcon } from '@heroicons/vue/20/solid';
import { PhotoIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '@/firebase.js';
import { ref } from 'vue';
import { processCSV, importData } from '@/composables/importData.js';
import Field from '@/components/Field.vue';
import { useLocalStorage } from '@vueuse/core';
import moment from 'moment';

export default {
  components: { Field, DataTable, CameraIcon, PhotoIcon, XCircleIcon },

  emits: ['close'],
  props: ['songRecordsDB'],

  setup(props, { emit }) {
    const { user } = useAuth();
    const isLoading = ref(false);
    const isProcessed = ref(false);
    const isImporting = ref(false);

    const hide = () => {
      if (isLoading.value || isImporting.value) { return; }
      emit('close');
    }

    const fileInput = ref(null);
    const inputKey = ref(false);
    const validInput = ref(false);

    const selectedFile = () => {
      let file = fileInput.value.files[0];
      if (!file || (file.type !== 'text/csv')) {
        alert(".csv or .xlsx pls");
        inputKey.value = !inputKey.value;
        return false;
      }
      validInput.value = true;
    }

    const headers = useLocalStorage('importHeaders', {
      songID: 'songID',
      date: 'date',
      difficulty: 'difficulty',
      great: 'great',
      good: 'good',
      bad: 'bad',
      miss: 'miss',
      imageLink: 'imageLink',
      noPL: 'noPL'
    });

    const recordsToUpdate = ref(null), newBestRecords = ref(null), newRecords = ref(null);
    const recsToUpdate = ref(null);

    const dataFilter = useLocalStorage('dataFilter','newBest');

    const dt_options = {
      searching: false,
      paging: false,
      scrollX: true,
      scrollY: '220px'
    };

    const cols = [
      { data: 'songID' },
      { data: 'difficulty' },
      { data: 'bestCB', render: function (data) { if (!data) { return ''; } return data; } },
      { data: 'bestCB_NoPL', render: function (data) { if (!data) { return ''; } return data; } },
      { data: 'bestPerf', render: function (data) { if (!data) { return ''; } return data; } },
      { data: 'bestPerf_NoPL', render: function (data) { if (!data) { return ''; } return data; } },
      { data: 'date',
        render: function (data){
          return moment(new Date(data)).format('YYYY-MM-DD');
        } },
      { data: 'noPL',
        render: function (data){
          if (data) { return 1; }
          return 0;
        } },
      { data: 'great' },
      { data: 'good' },
      { data: 'bad' },
      { data: 'miss' },
      { data: 'imageLink',
        render: function (data){
          if (!data) { return " "; }
          return `<a target="_blank" href="${data}">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </a>`;
        } },
    ]

    const startProcessing = async () => {
      let file = fileInput.value.files[0];
      isLoading.value = true;
      isProcessed.value = false;
      const res = await processCSV(user.value?.uid, file, headers.value, props.songRecordsDB);

      recordsToUpdate.value = res.recsToUpdate;
      newBestRecords.value = res.newBestRecs;
      newRecords.value = res.newRecs;

      recsToUpdate.value = recordsToUpdate.value.map(i => { return {'bestAttr': i.bestAttr, ...i.currentRec} })

      isLoading.value = false;
      isProcessed.value = true;
    }

    const startImport = async () => {
      let confirmStart = confirm("u sure");
      if (!confirmStart){
        return;
      }

      isImporting.value = true;

      await importData(user.value?.uid, recordsToUpdate.value, newBestRecords.value, newRecords.value);
      sessionStorage.removeItem('songRecordsDB');
      sessionStorage.removeItem('songNotesDB');

      isImporting.value = false;
    }

    return {
      user, isLoading, hide,
      fileInput, selectedFile, inputKey, headers, validInput,
      startProcessing, newBestRecords, recsToUpdate, newRecords, isProcessed, startImport, isImporting,
      dt_options, cols, dataFilter
    };
  }
}
</script>

<style scoped>
@import 'datatables.net-dt';
</style>