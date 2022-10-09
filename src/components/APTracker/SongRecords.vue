<template>
  <div class="h-full w-full fixed top-0 left-0 z-20 bg-zinc-500 opacity-40 sm:invisible" @click="hide"></div>
  <div class="flex sm:sticky sm:top-4 justify-center">

    <div class="fixed sm:sticky top-4 flex flex-col max-w-xs z-30 p-4
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
    </div>
  </div>

</template>

<script>
import Field from '../Field.vue';
export default {
  components: { Field },
  emits: ['close'],
  props: ['song'],
  setup(props, { emit }) {
    const hide = () => {
      emit('close');
    };

    return { hide };
  }
}
</script>