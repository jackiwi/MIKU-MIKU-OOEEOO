import { deleteRecordDB, updateNewBestRecord } from '@/firebase';
import { filterBest } from '@/composables/filterBest';
import { getSongRecords } from '@/composables/getUserSongDetails';

export const deleteRecord = async (userUID:string, oldRecord:any, userSongRecords:any) => {
  const bestPerfRecords = filterBest(userSongRecords, 'ap');
  const bestCBRecords = filterBest(userSongRecords, 'fc');
  const songRecords = getSongRecords(userSongRecords, oldRecord.songID, oldRecord.difficulty);
  let updatedRecords = new Set();

  if (bestPerfRecords?.filter((i:any) => { return i.id == oldRecord.id; })[0]){
    let addAttr = await updateNewBestRecord(userUID, oldRecord, songRecords, 'ap');
    if (addAttr){
      updatedRecords.add(addAttr);
    }
  }
  if (bestCBRecords?.filter((i:any) => { return i.id == oldRecord.id; })[0]){
    let addAttr = await updateNewBestRecord(userUID, oldRecord, songRecords, 'fc');
    if (addAttr){
      updatedRecords.add(addAttr);
    }
  }

  await deleteRecordDB(userUID, oldRecord);

  updatedRecords.add({'deletedRecordID': oldRecord.id});
  return Array.from(updatedRecords);
}