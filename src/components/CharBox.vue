<template>
  <span class="flex flex-wrap sm:flex-row place-content-center relative m-2 rounded outline">
    <span class="p-4" v-for="card in cards" :key="card.ID">
      <CardIcon :card="card"></CardIcon>
    </span>
  </span>
</template>

<script>
import CardIcon from '@/components/CardIcon.vue';

export default {
  props: [ 'cards' ],
  components: { CardIcon },
}
</script>