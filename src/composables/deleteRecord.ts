import { deleteRecordDB, updateNewBestRecord } from '@/firebase.js';
import { filterBest } from '@/composables/filterBest.js';
import { getSongRecords } from '@/composables/getUserSongDetails.js';

export const deleteRecord = async (userUID, oldRecord, userSongRecords) => {
  const bestPerfRecords = filterBest(userSongRecords, 'ap');
  const bestCBRecords = filterBest(userSongRecords, 'fc');
  const songRecords = getSongRecords(userSongRecords, oldRecord.songID, oldRecord.difficulty);
  let updatedRecords = new Set();

  if (bestPerfRecords?.filter(i => { return i.id == oldRecord.id; })[0]){
    let addAttr = await updateNewBestRecord(userUID, oldRecord, songRecords, 'ap');
    if (addAttr){
      updatedRecords.add(addAttr);
    }
  }
  if (bestCBRecords?.filter(i => { return i.id == oldRecord.id; })[0]){
    let addAttr = await updateNewBestRecord(userUID, oldRecord, songRecords, 'fc');
    if (addAttr){
      updatedRecords.add(addAttr);
    }
  }

  await deleteRecordDB(userUID, oldRecord);

  updatedRecords.add({'deletedRecordID': oldRecord.id});
  return Array.from(updatedRecords);
}