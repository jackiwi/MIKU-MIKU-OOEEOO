import { getBestRecordsDB, updateBestRecord, addNewRecord } from '@/firebase.js';

export const submitRecord = async (userUID, newRecord) => {
  const bestPerfRecord = (await getBestRecordsDB(userUID, 'ap'))?.filter(i => { return i.songID == newRecord.songID && i.difficulty == newRecord.difficulty })[0];
  const bestCBRecord = (await getBestRecordsDB(userUID, 'fc'))?.filter(i => { return i.songID == newRecord.songID && i.difficulty == newRecord.difficulty })[0];
  
  let newCBs = newRecord.good + newRecord.bad + newRecord.miss;
  let newPerfs = newCBs + newRecord.great;
  let bestCBs = bestCBRecord?.good + bestCBRecord?.bad + bestCBRecord?.miss;
  let bestPerfs = bestCBs + bestPerfRecord?.great;

  if (!bestPerfRecord
      || newPerfs < bestPerfs
      || (newPerfs == bestPerfs && (!bestPerfRecord.noPL || newRecord.noPL))){
    newRecord.bestPerf = true;
    await updateBestRecord(userUID, bestPerfRecord?.id, 'ap');
  }
  if (!bestCBRecord
      || newCBs < bestCBs
      || (newCBs == bestCBs && (!bestCBRecord.noPL || newRecord.noPL))){
    newRecord.bestCB = true;
    await updateBestRecord(userUID, bestCBRecord?.id, 'fc');
  }

  await addNewRecord(userUID, newRecord);
}

