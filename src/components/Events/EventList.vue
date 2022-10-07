<template>
  <div class="flex place-content-center mb-10" v-for="event in events" :key="event.ID">
    <Event
      :event=event
      :eventCards="getEventCards(event.ID)"
      :otherCards="getOtherCards(event['Start date'],event['End date'])">
    </Event>
  </div>
</template>

<script>
import Event from '@/components/Events/Event.vue';
import cards from '@/../public/data/cards.json';

export default {
  components: { Event },

  props: [ 'events' ],
  
  setup(){
    const getEventCards = (eventId) => {
      return cards.filter((i) => {
        return i["Event ID"] == eventId;
      });
    };
    const getOtherCards = (start,end) => {
      var startDate = new Date(start.substring(0,11));
      var endDate = new Date(end.substring(0,11));
      return cards.filter((i) => {
        var cardDate = new Date(i["Date added"]);
        cardDate = new Date(cardDate.setDate(cardDate.getDate() + 1));
        return (!i["Associated event"] && startDate <= cardDate && cardDate <= endDate);
      });
    };

    return { cards, getEventCards, getOtherCards };
  }
}
</script>