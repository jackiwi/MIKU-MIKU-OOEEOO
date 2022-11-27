import { getBestRecordsDB, updateBestRecord, addNewRecord } from '@/firebase.js';

let bestPerfRecords = null;
let bestCBRecords = null;
let bestPerfRecords_NoPL = null;
let bestCBRecords_NoPL = null;

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
  }

  return newRecord;
}

export const submitRecord = async (userUID, newRecord) => {
  bestPerfRecords = await getBestRecordsDB(userUID, 'ap');
  bestCBRecords = await getBestRecordsDB(userUID, 'fc');
  bestPerfRecords_NoPL = await getBestRecordsDB(userUID, 'ap', true);
  bestCBRecords_NoPL = await getBestRecordsDB(userUID, 'fc', true);

  newRecord = await updateBest(userUID, newRecord);
  if (newRecord.noPL){
    newRecord = await updateBest(userUID, newRecord, true);
  }

  await addNewRecord(userUID, newRecord);
}

