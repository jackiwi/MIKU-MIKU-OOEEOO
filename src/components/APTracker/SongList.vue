<template>
  <div v-if="!userUID || (userUID && bestRecords.length)" ref="scrollComponent" >
    <div v-for="song in songList" :key="song.ID"
      class="py-2">
      <Song :song="song" :bestRecord="bestRecords?.filter((i) => i.songID == song.ID)[0]"></Song>
    </div>
  </div>
</template>

<script>
import Song from '@/components/APTracker/Song.vue';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  components: { Song },
  props: [ 'songListAll', 'key', 'userUID', 'bestRecords' ],
  setup(props){
    const scrollComponent = ref(null);
    const pageNum = ref(0);

    const songList = ref(props.songListAll.slice(0,10));

    const moremoreSONGS = () => {
      pageNum.value++;
      var num = pageNum.value*10;
      songList.value.push(...props.songListAll.slice(num,num+10));
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    const handleScroll = (e) => {
      var element = scrollComponent.value;
      if (element.getBoundingClientRect().bottom < window.innerHeight) {
        moremoreSONGS();
      } 
    };

    return { songList, scrollComponent };
  }
}
</script>