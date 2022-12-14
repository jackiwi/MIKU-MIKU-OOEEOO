import { updateBestRecord, addNewRecord } from '@/firebase.js';
import { filterBest } from '@/composables/filterBest.js';

let bestPerfRecords = null;
let bestCBRecords = null;
let bestPerfRecords_NoPL = null;
let bestCBRecords_NoPL = null;
let updatedRecords = null;

const updateBest = async (userUID, newRecord, noPL = null) => {  
  let bestPerfRecord = null;
  let bestCBRecord = null;

  if (!noPL){
    bestPerfRecord = bestPerfRecords?.filter(i => { return i.songID == newRecord.songID && i.difficulty == newRecord.difficulty })[0];
    bestCBRecord = bestCBRecords?.filter(i => { return i.songID == newRecord.songID && i.difficulty == newRecord.difficulty })[0];
  }else{
    bestPerfRecord = bestPerfRecords_NoPL?.filter(i => { return i.songID == newRecord.songID && i.difficulty == newRecord.difficulty })[0];
    bestCBRecord = bestCBRecords_NoPL?.filter(i => { return i.songID == newRecord.songID && i.difficulty == newRecord.difficulty })[0];
  }

  let newCBs = newRecord.good + newRecord.bad + newRecord.miss;
  let newPerfs = newCBs + newRecord.great;
  let bestCBs = bestCBRecord?.good + bestCBRecord?.bad + bestCBRecord?.miss;
  let bestPerfs = bestCBs + bestPerfRecord?.great;

  if (!bestPerfRecord
      || newPerfs < bestPerfs
      || (newPerfs == bestPerfs && (!bestPerfRecord.noPL || newRecord.noPL))){
    if (noPL){
      newRecord.bestPerf_NoPL = true;
      await updateBestRecord(userUID, bestPerfRecord?.id, 'ap', true);
    }else{
      newRecord.bestPerf = true;
      await updateBestRecord(userUID, bestPerfRecord?.id, 'ap');  
    }
    let attr = noPL ? 'bestPerf_noPL' : 'bestPerf';
    updatedRecords.add({'removeAttrID': bestPerfRecord?.id, 'attr': attr});
  }
  if (!bestCBRecord
      || newCBs < bestCBs
      || (newCBs == bestCBs && (!bestCBRecord.noPL || newRecord.noPL))){
    if (noPL){
      newRecord.bestCB_NoPL = true;
      await updateBestRecord(userUID, bestPerfRecord?.id, 'fc', true);
    }else{
      newRecord.bestCB = true;
      await updateBestRecord(userUID, bestCBRecord?.id, 'fc');  
    }
    let attr = noPL ? 'bestCB_noPL' : 'bestCB';
    updatedRecords.add({'removeAttrID': bestCBRecord?.id, 'attr': attr});
  }

  return newRecord;
}

export const submitRecord = async (userUID, newRecord, userSongRecords) => {
  bestPerfRecords = filterBest(userSongRecords, 'ap');
  bestCBRecords = filterBest(userSongRecords, 'fc');
  bestPerfRecords_NoPL = filterBest(userSongRecords, 'ap', true);
  bestCBRecords_NoPL = filterBest(userSongRecords, 'fc', true);
  updatedRecords = new Set();

  newRecord = await updateBest(userUID, newRecord);
  if (newRecord.noPL){
    newRecord = await updateBest(userUID, newRecord, true);
  }

  const newRecID = await addNewRecord(userUID, newRecord);

  updatedRecords.add({'newRecord': {...newRecord, id: newRecID}});
  return Array.from(updatedRecords);
}

