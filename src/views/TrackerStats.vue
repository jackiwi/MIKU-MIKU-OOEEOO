<template>
  <div>hi</div>
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