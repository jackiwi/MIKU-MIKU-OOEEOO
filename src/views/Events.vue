<template>
  <div class="flex justify-center pb-4">
    <EventFilter @updateEventList="updateEventList"></EventFilter>
  </div>
  <EventList :events="events"></EventList>
</template>

<script>
import EventFilter from '@/components/Events/EventFilter.vue';
import EventList from '@/components/Events/EventList.vue';
import eventList from '@/../public/data/events.json';
import { ref } from 'vue';

export default {
  components: { EventFilter, EventList },

  setup(){
    const events = ref(null);

    const updateEventList = (startDate, endDate, searchTerm, focusUnit, bonusAttr, eventType) => {
      var dateStart = new Date(startDate.value);
      var dateEnd = new Date(endDate.value);
      events.value = eventList.filter((i) => {
        var eventStart = new Date(i['Start date'].substring(0,11));
        var eventEnd = new Date(i['End date'].substring(0,11));
        return i['Event Name'].toLowerCase().includes(searchTerm.value.toLowerCase())
          && focusUnit.value.includes(i['Unit focus'])
          && bonusAttr.value.includes(i['Bonus attribute'])
          && eventStart <= dateEnd && dateStart <= eventEnd
          && eventType.value.includes(i['Type']);
      });
    };

    return { events, updateEventList };
  }
}
</script>