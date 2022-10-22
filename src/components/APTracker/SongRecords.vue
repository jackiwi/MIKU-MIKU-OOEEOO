<template>
  <div class="h-full w-full fixed top-0 left-0 z-20 bg-zinc-500 opacity-40 sm:invisible" @click="hide"></div>
  <div class="flex sm:sticky sm:top-4 justify-evenly">

    <div class="fixed sm:sticky top-4 flex flex-col max-w-xs sm:max-w-[35%] z-30 p-4
      overflow-y-scroll max-h-[95%] sm:max-h-[40rem]
      bg-yellow-200 rounded-lg shadow outline outline-amber-400 border-8 border-amber-50">

      <div class="flex flex-col place-content-center">
        <div class="flex justify-center relative">
          <img :src="`https://${ song['Jacket art'] }`"
            class="max-w-[50%] sm:max-w-full sm:max-h-full" />
            
          <div class="absolute -top-2 -right-3 z-30 sm:invisible">
            <XCircleIcon @click="hide" class="w-6 h-6 text-amber-700"></XCircleIcon>
          </div>
        </div>

        <div class="">
          <Field label="song title:">{{ song['Song title'] }}</Field>
          <Field label="producer(s):">
            <div v-if="Array.isArray(song['Producer(s)'])" v-for="producer in song['Producer(s)']" :key="producer">
              {{ producer }}
            </div>
            <div v-else>
              {{ song['Producer(s)'] }}
            </div>
          </Field>
          <Field label="unit(s):">
            <div v-if="Array.isArray(song['Unit(s)'])" v-for="unit in song['Unit(s)']" :key="unit">
              {{ unit }}
            </div>
            <div v-else>
              {{ song['Unit(s)'] }}
            </div>
          </Field>
          <Field label="BPM:">{{ song['BPM'] }}</Field>
          <Field label="duration:">{{ song['Duration'] }}</Field>
          <Field label="difficulty:">{{ song['Master difficulty'] }}</Field>
          <Field label="num notes:">{{ song['Master notes'] }}</Field>
        </div>
      </div>

      <div class="flex flex-col sm:hidden pt-4">
        <div>
          <textarea v-model="songNote" rows="4" cols="25" placeholder="notes:" />
        </div>
        <div class="flex justify-end">
          <button @click="updateSongNote"
            :disabled="songNote == savedSongNote">save</button>
        </div>
        <DataTable v-if="!dtLoading" class="display row-border" :columns="cols" :data="data"
            :options="{...dt_options, columnDefs:[{visible: false, targets: [3,4,5,6]}, {orderable: false, targets: [7,8]}]}">
          <thead>
            <tr>
              <th>date</th>
              <th>no PL</th>
              <th>np</th>
              <th>gr</th>
              <th>g</th>
              <th>b</th>
              <th>m</th>
              <th>
                <CameraIcon class="w-5 h-5"></CameraIcon>
              </th>
              <th>
                <TrashIcon class="w-5 h-5"></TrashIcon>
              </th>
            </tr>
          </thead>
        </DataTable>
      </div>

    </div>
    
    <div class="hidden p-4 sm:flex sm:flex-col">
      <div>
        <textarea v-model="songNote" rows="4" cols="50" placeholder="notes:" />
      </div>
      <div class="flex justify-end">
        <button @click="updateSongNote"
          :disabled="songNote == savedSongNote">save</button>
      </div>
      <DataTable v-if="!dtLoading" class="display row-border" :columns="cols" :data="data"
          :options="{...dt_options, columnDefs:[{visible: false, targets: 2}, {orderable: false, targets: [7,8]}]}"
          ref="table">
        <thead>
          <tr>
            <th class="w-24">date</th>
            <th>no PL</th>
            <th>nonperfs</th>
            <th>gr</th>
            <th>g</th>
            <th>b</th>
            <th>m</th>
            <th>
              <CameraIcon class="w-5 h-5"></CameraIcon>
            </th>
            <th>
              <TrashIcon class="w-5 h-5"></TrashIcon>
            </th>
          </tr>
        </thead>
      </DataTable>
    </div>
  
  </div>

</template>

<script>
import DataTable from 'datatables.net-vue3';
import Field from '@/components/Field.vue';
import { computed, onMounted, ref } from 'vue';
import { useAuth, setSongNote, deleteRecord } from '@/firebase.js';
import { CameraIcon, TrashIcon} from '@heroicons/vue/20/solid';
import { CheckCircleIcon, XMarkIcon, PhotoIcon, XCircleIcon } from '@heroicons/vue/24/outline';

export default {
  components: {
    Field, DataTable,
    CameraIcon, TrashIcon,
    CheckCircleIcon, XMarkIcon, PhotoIcon, XCircleIcon
  },
  emits: ['close'],
  props: ['song', 'songRecords', 'songNotes'],
  setup(props, { emit }) {
    const { user } = useAuth();
    const hide = () => {
      emit('close');
    };

    let dt;
    const table = ref();

    onMounted(() => {
      dt = table.value.dt();
      const delButtons = document.getElementsByClassName("deleteRecord");
      for (let i = 0; i < delButtons.length; i++) {
        let id = delButtons[i].getAttribute("id");
        delButtons[i].addEventListener('click', e => delRecord(id, i - 1));
      }
    });

    const cols = [
      { data: 'date' },
      { data: 'noPL',
        render: function (data){
          if (data){
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                      class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>`;
          }
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    class="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>`;
        } },
      { data: 'nonperfs' },
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
      { data: 'id',
        render: function (data){
          return `<svg id="${data}" class="deleteRecord w-5 h-5 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>`
        } },
    ];

    const dt_options = {
      paging: false,
      searching: false,
      scrollY: true,
      order: [[0, 'desc'], [2, 'asc']]
    };

    const dtLoading = ref(false);
    const songNote = ref(null);
    const savedSongNote = ref(null);
    const noteID = ref(null);

    const data = computed(() => {
      songNote.value = props.songNotes?.note;
      savedSongNote.value = props.songNotes?.note;
      noteID.value = props.songNotes?.id;
      return props.songRecords ?? [];
    });

    const updateSongNote = async () => {
      noteID.value = await setSongNote(user.value.uid, props.song?.ID, songNote.value, noteID.value);
      savedSongNote.value = songNote.value;
    };

    const delRecord = async (id, index) => {
      let confirmDelete = confirm("u sure");
      if (!confirmDelete){
        return;
      }
      dtLoading.value = true;
      await deleteRecord(user.value.uid, id);
      data.value.splice(index, 1);
      dtLoading.value = false;
    }

    return {
      hide,
      table, cols, data, dt_options, dtLoading,
      songNote, savedSongNote,
      updateSongNote, deleteRecord
    };
  }
}
</script>


<style scoped>
@import 'datatables.net-dt';
</style>