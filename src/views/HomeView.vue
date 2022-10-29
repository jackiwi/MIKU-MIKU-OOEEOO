<template>
  <div class="home">
    <a href="https://adambailey.io/blog/scroll-to-top-button-vue/" target="_blank">scroll-to-top</a>
    <br />
    <a href="https://frontendresource.com/css-corners/" target="_blank">fancy corner decoration</a>
    <br />
    <a href="https://learnvue.co/tutorials/vue-infinite-scrolling" target="_blank">infini scroll</a>
    <br />
    <a href="https://iknowthatnow.com/2022/05/02/popup-modal-component-in-vue-3/" target="_blank">modal</a>
    <br />
    <a href="https://stackoverflow.com/questions/69400560/how-to-change-scrollbar-when-using-tailwind-next-js-react" target="_blank">custom scrollbar</a>
    <br />
    <a href="https://datatables.net/blog/2022-06-22-vue#top" target="_blank">datatable</a>
    <br />
    data sourced from <a href="https://www.sekaipedia.org/wiki/Main_Page" target="_blank">sekaipedia</a>
    <br />

    <div class="flex justify-center mt-4">
      <div class="p-4
        bg-yellow-200 rounded-lg shadow outline outline-amber-400 border-8 border-amber-50">
        the planTM:<br />
        <span class="line-through">trello board???</span><br />
        <ul>
          <li>loading ui</li>
          <li>ocr</li>
          <li>export data</li>
          <li>condensed view</li>
          <li>dark mode (ఠ్ఠ` ▽ ´ఠ్ఠ)</li>
          <li>discord auth???</li>
          <li>about/info</li>
          <li>make it prettier _(:3」∠)_</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import { getRecords } from '@/firebase.js';

export default {
  name: 'HomeView',
  setup(){
    //getRecords();
  }
}
</script>
