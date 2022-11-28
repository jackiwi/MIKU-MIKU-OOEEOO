import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs,
  query, where, setDoc, doc, addDoc, updateDoc, deleteDoc, writeBatch, onSnapshot
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { onUnmounted, ref } from 'vue';

import { firebaseConfig } from '@/../sConfig.js';

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const recordsCollection = collection(db, 'records');
const notesCollection = collection(db, 'songNotes');

export function useAuth() {
  const user = ref(null);

  const unsubscribe = onAuthStateChanged(auth, async (_user) => {
    user.value = _user;
    if (user.value){
      //console.log('logged in',user);
    }else{
      //console.log('logged out');
      sessionStorage.removeItem('songRecordsDB');
      sessionStorage.removeItem('songNotesDB');
    }
  });

  onUnmounted(unsubscribe);

  return { user };
}

export function signInEmail(email, password){
  signInWithEmailAndPassword(auth, email, password)
    .catch((err) => {
      console.log(err.message);
    });
}

export function signOutUser(){
  signOut(auth)
    .catch((err) => {
      console.log(err.message);
    });
}

export function signupEmailPassword(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created:', cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
}

export async function getBestRecordsDB(userUID, trackerMode, noPL = null){
  if (!userUID) { return; }

  let tracker = trackerMode == 'ap' ? "bestPerf" : "bestCB";
  if (noPL) { tracker += '_NoPL'; }

  const q = query(recordsCollection, where("userUID","==",userUID), where(tracker,"==",true));
  const snapshot = await getDocs(q);

  const bestRecords = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return bestRecords;
}

export async function getAllRecordsDB(userUID){
  if (!userUID) { return; }

  const q = query(recordsCollection, where("userUID","==",userUID));

  const snapshot = await getDocs(q);

  const allRecords = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return allRecords;

  // return new Promise((resolve, reject) => {
  //   const unsubRecords = onSnapshot(q, (snapshot) => {
  //     console.log('getting records');
  //     const allRecords = snapshot.docs.map((doc) => {
  //       return { ...doc.data(), id: doc.id };
  //     });
  //     resolve({'allRecords': allRecords, 'unsubRecords': unsubRecords});
  //   });
  // });
     
}

export async function getAllNotesDB(userUID){
  if (!userUID) { return; }

  const q = query(notesCollection, where("userUID","==",userUID));

  return new Promise((resolve, reject) => {
    const unsubNotes = onSnapshot(q, (snapshot) => {
      console.log('getting notes');
      const allNotes = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      resolve({'allNotes': allNotes, 'unsubNotes': unsubNotes});
    });
  });
}

export async function getSongRecords(userUID, songID, songDifficulty){
  if (!userUID){ return null; }

  const q = query(recordsCollection,
    where("userUID","==",userUID),
    where("songID","==",parseInt(songID)),
    where("difficulty","==",songDifficulty.toLowerCase()));
  const snapshot = await getDocs(q);

  const songRecords = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return songRecords;
}

export async function getSongNotes(userUID, songID){
  if (!userUID){
    return null;
  }

  const q = query(notesCollection, where("userUID","==",userUID), where("songID","==",parseInt(songID)));
  const snapshot = await getDocs(q);

  const songNote = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return songNote[0] ?? null;
}
export async function setSongNote(userUID, songID, songNote, noteID){
  if (!userUID){ return null; }

  if (!noteID){
    const newNote = await addDoc(notesCollection, {
      note: songNote,
      songID: parseInt(songID),
      userUID: userUID
    });
    return newNote.id;
  }else{
    await setDoc(doc(notesCollection, noteID), {
      note: songNote,
      songID: parseInt(songID),
      userUID: userUID
    });
    return noteID;
  }
}

export async function updateBestRecord(userUID, oldRecordID, trackerMode, noPL = null){
  if (!userUID || !oldRecordID){ return null; }

  let attr = trackerMode == 'ap' ? 'bestPerf' : 'bestCB';
  if (noPL) { attr += '_NoPL'; }

  await updateDoc(doc(recordsCollection, oldRecordID), {
    [attr]: false
  });
  return oldRecordID;
}

export async function updateNewBestRecord(userUID, oldRecord, trackerMode){
  if (!userUID || !oldRecord){ return null; }

  await updateBest(userUID, oldRecord.songID, oldRecord.difficulty, null, trackerMode, false);
}

export async function addNewRecord(userUID, newRecord){
  if (!userUID){ return null; }

  await addDoc(recordsCollection, {
    ...newRecord,
    userUID: userUID
  });
}

export async function deleteRecordDB(userUID, delRecord){
  if (!userUID){ return null; }

  await deleteDoc(doc(recordsCollection, delRecord.id));
}

const sortSongRecords = (records, trackMode) => {
  return records.sort((a,b) => {
    if (a[trackMode] - b[trackMode] != 0){
      return a[trackMode] - b[trackMode];
    }
    return (new Date(a.date) - new Date(b.date));
  });
}

const updateBest = async (userUID, songID, diff, noPL, trackerMode, refactoring) => {
  let songRecords = (await getSongRecords(userUID, songID, diff))
    .filter(i => { return noPL ? i.noPL : true; })
    .map(i => {
      return {
        ...i,
        breaks: i.good + i.bad + i.miss,
        nonperfs: i.great + i.good + i.bad + i.miss
      }
    });
  
  let trackMode = trackerMode == 'fc' ? 'breaks' : 'nonperfs';
  songRecords = sortSongRecords(songRecords, trackMode);
  let index = refactoring ? 0 : 1;

  let newBestRecordID = songRecords[index]?.id;
  if (newBestRecordID) {

    let attr = 'best';
    if (trackerMode == 'ap'){ attr += 'Perf'; }
      else if (trackerMode == 'fc'){ attr += 'CB'; }
    if (noPL){ attr += '_NoPL'; }

    await updateDoc(doc(db,"records", newBestRecordID), {
      [attr]: true
    });
  }
}

export async function refactorRecordsNoPL(userUID){
  if (!userUID) { return; }

  const allRecords = await getBestRecordsDB(userUID, 'fc');

  const songIDs = [ ...new Set(allRecords.map(i => { return i.songID; })) ]; 
  const songDifficulties = [ ...new Set(allRecords.map(i => { return i.difficulty; })) ]; 

  songIDs.forEach(async (id) => {
    songDifficulties.forEach(async (diff) => {
      await updateBest(userUID, id, diff, true, 'ap', true);
      await updateBest(userUID, id, diff, true, 'fc', true);
    });
  });
}

export async function batchUpdate(userUID, recordsToUpdate, newBestRecords, timestamp){
  if (!userUID) { return; }

  const promises = [];
  let counter = 0, totalCount = 0, numID = 0;

  let batch = writeBatch(db);

  recordsToUpdate.forEach(i => {
    batch.update(doc(recordsCollection, i.currentRec.id), { [i.bestAttr]: false });
    counter++;
    if (counter >= 500) {
      promises.push(batch.commit());
      totalCount += counter;
      counter = 0;
      batch = writeBatch(db);
    }
  });

  newBestRecords.forEach(newRecord => {
    let id = timestamp + numID.toString();
    batch.set(doc(recordsCollection, id), {
      ...newRecord,
      userUID: userUID
    });
    counter++;
    numID++;
    if (counter >= 500){
      promises.push(batch.commit());
      totalCount += counter;
      counter = 0;
      batch = writeBatch(db);
    }
  });
  if (counter){
    promises.push(batch.commit());
    totalCount+= counter;
  }

  await Promise.all(promises);
}

export async function batchAdd(userUID, recordsToAdd, timestamp){
  if (!userUID) { return; }

  const promises = [];
  let counter = 0, totalCount = 0, numID = 0;

  let batch = writeBatch(db);
  recordsToAdd.forEach(newRecord => {
    let id = timestamp + numID.toString();
    batch.set(doc(recordsCollection, id), {
      ...newRecord,
      userUID: userUID
    });
    counter++;
    numID++;
    if (counter >= 500){
      promises.push(batch.commit());
      totalCount += counter;
      counter = 0;
      batch = writeBatch(db);
    }
  });
  if (counter){
    promises.push(batch.commit());
    totalCount+= counter;
  }

  await Promise.all(promises);
}