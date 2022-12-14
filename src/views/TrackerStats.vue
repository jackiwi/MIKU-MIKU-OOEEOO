<template>
  <div>hi</div>
  <div v-if="user && user.email == 'jackiwi.art@gmail.com'">
    <div>if you aren't me and you're somehow looking at this no you aren't</div>
    <div class="flex justify-center gap-2">
      <button class="w-fit" @click="showImportModal = !showImportModal;">import</button>
      <button class="w-fit">export</button>
      <button class="w-fit" @click="refactorRecords">refactor records</button>
    </div>
    <div v-if="showImportModal" class="w-full flex justify-center">
      <ImportModal
        :songRecordsDB = songRecordsDB
        @close="showImportModal = false;">
      </ImportModal>
    </div>
  </div>

  <div class="flex justify-center mt-4">
    <div class="p-4
      box-light">
      <span class="font-bold">the planTM:</span><br />
      <ul>
        <li>total APs {{totalAP}}</li>
        <li>total FCs {{totalFC}}</li>
      </ul>
    </div>
  </div>

</template>

<script>
import { useAuth, refactorRecordsNoPL, getAllRecordsDB, getAllNotesDB } from '@/firebase';
import ImportModal from '@/components/APTracker/ImportModal.vue';
import { useSessionStorage } from '@vueuse/core';
import { ref, watch } from 'vue';

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

    const songRecordsDB = useSessionStorage('songRecordsDB', []);
    const songNotesDB = useSessionStorage('songNotesDB', []);
    const isLoading = ref(false);

    const totalAP = ref(null);
    const totalFC = ref(null);

    watch(user, async () => {
      isLoading.value = true;
      if (user && user.value.uid){
        if (!songRecordsDB.value || songRecordsDB.value.length == 0){
          songRecordsDB.value = await getAllRecordsDB(user.value.uid);
          songNotesDB.value = await getAllNotesDB(user.value.uid);
        }
        totalAP.value = {
          'easy': getStats(songRecordsDB.value, 'ap', 'easy'),
          'normal': getStats(songRecordsDB.value, 'ap', 'normal'),
          'hard': getStats(songRecordsDB.value, 'ap', 'hard'),
          'expert': getStats(songRecordsDB.value, 'ap', 'expert'),
          'master': getStats(songRecordsDB.value, 'ap', 'master'),
          'easy_noPL': getStats(songRecordsDB.value, 'ap', 'easy', true),
          'normal_noPL': getStats(songRecordsDB.value, 'ap', 'normal', true),
          'hard_noPL': getStats(songRecordsDB.value, 'ap', 'hard', true),
          'expert_noPL': getStats(songRecordsDB.value, 'ap', 'expert', true),
          'master_noPL': getStats(songRecordsDB.value, 'ap', 'master', true),
        };
        totalFC.value = {
          'easy': getStats(songRecordsDB.value, 'fc', 'easy'),
          'normal': getStats(songRecordsDB.value, 'fc', 'normal'),
          'hard': getStats(songRecordsDB.value, 'fc', 'hard'),
          'expert': getStats(songRecordsDB.value, 'fc', 'expert'),
          'master': getStats(songRecordsDB.value, 'fc', 'master'),
          'easy_noPL': getStats(songRecordsDB.value, 'fc', 'easy', true),
          'normal_noPL': getStats(songRecordsDB.value, 'fc', 'normal', true),
          'hard_noPL': getStats(songRecordsDB.value, 'fc', 'hard', true),
          'expert_noPL': getStats(songRecordsDB.value, 'fc', 'expert', true),
          'master_noPL': getStats(songRecordsDB.value, 'fc', 'master', true),
        };
      }
      isLoading.value = false;
    });

    const getStats = (allRecords, trackerMode, difficulty, noPL = null) => {
      if (!allRecords) return;
      let attr = trackerMode == 'ap' ? 'nonperfs' : 'breaks';

      return [...(new Set(allRecords
        .filter(i => {
          return i[attr] == 0
          && i.difficulty.toLowerCase() == difficulty.toLowerCase()
          && (!noPL || i.noPL);
        })
        .map(i => { return i.songID; })))].length;
    }

    return {
      refactorRecords, user, showImportModal, isLoading,
      songRecordsDB, totalAP, totalFC
    }
  }
}
</script>