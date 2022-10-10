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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              class="w-6 h-6 text-amber-700" @click="hide">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
        <DataTable class="display row-border" :columns="cols" :data="data" :options="{...dt_options, columnDefs:[{visible: false, targets:[3,4,5,6]}]}">
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
              </th>
            </tr>
          </thead>
        </DataTable>
      </div>

    </div>
    
    <div class="hidden p-4 sm:flex sm:flex-col">
      <div>
        <textarea rows="4" cols="50" placeholder="notes:" />
      </div>
      <DataTable class="display row-border" :columns="cols" :data="data" :options="{...dt_options, columnDefs:[{visible: false, targets: 2}]}">
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
            </th>
          </tr>
        </thead>
      </DataTable>
    </div>
  
  </div>

</template>

<script>
import Field from '../Field.vue';
import DataTable from 'datatables.net-vue3';
import { computed } from 'vue';

export default {
  components: { Field, DataTable },
  emits: ['close'],
  props: ['song', 'songRecords'],
  setup(props, { emit }) {
    const hide = () => {
      emit('close');
    };

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
          return `<a target="_blank" href="${data}">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </a>`;
        } },
    ];

    const dt_options = {
      paging: false,
      searching: false,
      scrollY: true,
      order: [[0, 'desc'], [2, 'asc']]
    };

    const data = computed(() => {
      return props.songRecords ?? [];
    })

    return { hide, cols, data, dt_options };
  }
}
</script>

<style scoped>
@import 'datatables.net-dt';
</style>