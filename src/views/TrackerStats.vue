<template>
  <div>hi</div>
  <div v-if="user && user.email == 'jackiwi.art@gmail.com'">
    <div>if you're somehow looking at this and you aren't me no you aren't</div>
    <div class="flex justify-center gap-2">
      <button class="w-fit" @click="showImportModal = !showImportModal;">import</button>
      <button class="w-fit">export</button>
      <button class="w-fit" @click="refactorRecords">refactor records</button>
    </div>
    <div v-if="showImportModal" class="w-full flex justify-center">
      <ImportModal
        @close="showImportModal = false;">
      </ImportModal>
    </div>
  </div>

  <div class="flex justify-center mt-4">
      <div class="p-4
        bg-yellow-200 rounded-lg shadow outline outline-amber-400 border-8 border-amber-50">
        <span class="font-bold">the planTM:</span><br />
        <ul>
          <li>total APs</li>
          <li>total FCs</li>
        </ul>
      </div>
    </div>

</template>

<script>
import { useAuth, refactorRecordsNoPL } from '@/firebase.js';
import ImportModal from '@/components/APTracker/ImportModal.vue';
import { ref } from 'vue';

export default {
  components: { ImportModal },
  setup() {
    const { user } = useAuth();

    const showImportModal = ref(false);

    const refactorRecords = async () => {
      let confirmDelete = confirm("u sure");
      if (!confirmDelete){
        return;
      }
      await refactorRecordsNoPL(user.value.uid);
    }

    return { refactorRecords, user, showImportModal }
  }
}
</script>