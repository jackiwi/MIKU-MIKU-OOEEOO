<template>
  <div class="max-w-2xl grow">
    <input class="py-2" type="text" placeholder="search term..." v-model="searchTerm" />

    <div class="py-2">
      <CheckBoxList :items="{
        'L/N': 'Leo/need',
        'MMJ': 'MORE MORE JUMP!',
        'VBS': 'Vivid BAD SQUAD',
        'W×S': 'Wonderlands×Showtime',
        '25ji': '25-ji, Nightcord de.',
        'Mixed': 'Mixed'}"
        :modelVal="focusUnit"
        modelValName="focusUnit"
        @updateCheckBoxList="updateCheckBoxList">
      </CheckBoxList>
    </div>

    <div class="py-2">
      <CheckBoxList :items="{
        'Pure': 'Pure',
        'Cute': 'Cute',
        'Mysterious': 'Mysterious',
        'Cool': 'Cool',
        'Happy': 'Happy'}"
        :modelVal="bonusAttr"
        modelValName="bonusAttr"
        @updateCheckBoxList="updateCheckBoxList">
      </CheckBoxList>
    </div>

    <div class="py-2">
      <CheckBoxList :items="{
        'Marathon': 'Marathon',
        'CC': 'Cheerful Carnival'
      }"
      :modelVal="eventType"
      modelValName="eventType"
      @updateCheckBoxList="updateCheckBoxList"></CheckBoxList>
    </div>

    <div class="flex justify-evenly py-2">
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
    </div>
  </div>
</template>

<script>
import CheckBoxList from '@/components/CheckBoxList.vue';
import { useLocalStorage } from '@vueuse/core';
import { watchEffect } from 'vue';

export default {
  components: { CheckBoxList },

  methods: {
    updateCheckBoxList(modelVal, modelValName){
      this[modelValName] = modelVal;
    }
  },

  setup(props, { emit }){
    const searchTerm = useLocalStorage('eventSearchTerm','');
    const focusUnit = useLocalStorage('focusUnit',["Leo/need", "MORE MORE JUMP!", "Vivid BAD SQUAD", "Wonderlands×Showtime", "25-ji, Nightcord de.", "Mixed"]);
    const bonusAttr = useLocalStorage('bonusAttr',["Pure","Cute","Mysterious","Cool","Happy"]);
    const eventType = useLocalStorage('eventType',["Marathon","Cheerful Carnival"]);
    const startDate = useLocalStorage('eventListStartDate','2020-09-30');
    const endDate = useLocalStorage('eventListEndDate',new Date(Date.now()).toISOString().substring(0,10));

    watchEffect(() => {
      emit('updateEventList', startDate, endDate, searchTerm, focusUnit, bonusAttr, eventType);
    });
    
    return { 
      searchTerm,
      focusUnit, bonusAttr,
      eventType,
      startDate, endDate
    };
  }
}
</script>