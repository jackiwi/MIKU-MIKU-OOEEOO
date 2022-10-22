import { getBestRecordsDB, updateBestRecord, addNewRecord } from '@/firebase.js';

export const submitRecord = async (userUID, newRecord) => {
  const bestRecord = (await getBestRecordsDB(userUID))?.filter(i => { return i.songID == newRecord.songID })[0];

  if (!bestRecord
      || newRecord.nonperfs < bestRecord.nonperfs
      || (newRecord.nonperfs == bestRecord.nonperfs && (!bestRecord.noPL || newRecord.noPL))){
    newRecord.best = true;
    await updateBestRecord(userUID, bestRecord?.id);
  }

  await addNewRecord(userUID, newRecord);
}

