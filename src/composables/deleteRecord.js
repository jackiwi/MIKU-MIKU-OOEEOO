import { deleteRecordDB, getBestRecordsDB, updateNewBestRecord } from '@/firebase.js';

export const deleteRecord = async (userUID, oldRecord) => {
  const bestPerfRecords = await getBestRecordsDB(userUID, 'ap');
  const bestCBRecords = await getBestRecordsDB(userUID, 'fc');

  if (bestPerfRecords?.filter(i => { return i.id == oldRecord.id; })[0]){
    await updateNewBestRecord(userUID, oldRecord, 'ap');
  }
  if (bestCBRecords?.filter(i => { return i.id == oldRecord.id; })[0]){
    await updateNewBestRecord(userUID, oldRecord, 'fc');
  }

  await deleteRecordDB(userUID, oldRecord);

}