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
import { onUnmounted, ref, Ref } from 'vue';

import { firebaseConfig } from '@/../sConfig.js';

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const recordsCollection = collection(db, 'records');
const notesCollection = collection(db, 'songNotes');

export function useAuth() {
  const user : Ref<any> = ref(null);

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

export function signInEmail(email:string, password:string){
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

export function signupEmailPassword(email:string, password:string) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created:', cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
}

export async function getBestRecordsDB(userUID:string, trackerMode:string, noPL = null){
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

export async function getAllRecordsDB(userUID:string){
  if (!userUID) { return; }
  console.log('getting records')

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

export async function getAllNotesDB(userUID:string){
  if (!userUID) { return; }
  console.log('getting notes')

  const q = query(notesCollection, where("userUID","==",userUID));

  const snapshot = await getDocs(q);

  const allNotes = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return allNotes;

  // return new Promise((resolve, reject) => {
  //   const unsubNotes = onSnapshot(q, (snapshot) => {
  //     console.log('getting notes');
  //     const allNotes = snapshot.docs.map((doc) => {
  //       return { ...doc.data(), id: doc.id };
  //     });
  //     resolve({'allNotes': allNotes, 'unsubNotes': unsubNotes});
  //   });
  // });
}

export async function getSongRecords(userUID:string, songID:any, songDifficulty:string){
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

export async function getSongNotes(userUID:string, songID:any){
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

export async function setSongNote(userUID:string, songID:any, songNote:string, noteID:any){
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

export async function updateBestRecord(userUID:string, oldRecordID:any, trackerMode:string, noPL = false){
  if (!userUID || !oldRecordID){ return null; }

  let attr = trackerMode == 'ap' ? 'bestPerf' : 'bestCB';
  if (noPL) { attr += '_NoPL'; }

  await updateDoc(doc(recordsCollection, oldRecordID), {
    [attr]: false
  });
  return oldRecordID;
}

export async function updateNewBestRecord(userUID:string, oldRecord:any, songRecordsAll:any, trackerMode:string){
  if (!userUID || !oldRecord){ return null; }

  return await updateBest(songRecordsAll, false, trackerMode, false);
}

export async function addNewRecord(userUID:string, newRecord:any){
  if (!userUID){ return null; }

  const docRef = await addDoc(recordsCollection, {
    ...newRecord,
    userUID: userUID
  });

  return docRef.id;
}

export async function deleteRecordDB(userUID:string, delRecord:any){
  if (!userUID){ return null; }

  await deleteDoc(doc(recordsCollection, delRecord.id));
}

const sortSongRecords = (records:any, trackMode:string) => {
  return records.sort((a:any,b:any) => {
    if (a[trackMode] - b[trackMode] != 0){
      return a[trackMode] - b[trackMode];
    }
    return (new Date(a.date).valueOf() - new Date(b.date).valueOf());
  });
}

const updateBest = async (songRecordsAll:any, noPL:boolean, trackerMode:string, refactoring:boolean) => {
  let songRecords =
    songRecordsAll.filter((i:any) => { return noPL ? i.noPL : true; })
    .map((i:any) => {
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

    await updateDoc(doc(recordsCollection, newBestRecordID), {
      [attr]: true
    });

    return { 'addAttrID': newBestRecordID, 'attr': attr };
  }
  return null;
}


export async function refactorRecordsNoPL(userUID:string){
  if (!userUID) { return; }

  // const allRecords = await getBestRecordsDB(userUID, 'fc');

  // const songIDs = [ ...new Set(allRecords.map(i => { return i.songID; })) ];
  // const songDifficulties = [ ...new Set(allRecords.map(i => { return i.difficulty; })) ];

  // songIDs.forEach(async (id) => {
  //   songDifficulties.forEach(async (diff) => {
  //     // await updateBest(userUID, id, diff, true, 'ap', true);
  //     // await updateBest(userUID, id, diff, true, 'fc', true);
  //   });
  // });
}

export async function batchUpdate(userUID:string, recordsToUpdate:any, newBestRecords:any, timestamp:string){
  if (!userUID) { return; }

  const promises = [];
  let counter = 0, totalCount = 0, numID = 0;

  let batch = writeBatch(db);

  recordsToUpdate.forEach((record:any) => {
    batch.update(doc(recordsCollection, record.currentRec.id), { [record.bestAttr]: false });
    counter++;
    if (counter >= 500) {
      promises.push(batch.commit());
      totalCount += counter;
      counter = 0;
      batch = writeBatch(db);
    }
  });

  newBestRecords.forEach((newRecord:any) => {
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

export async function batchAdd(userUID:string, recordsToAdd:any, timestamp:string){
  if (!userUID) { return; }

  const promises = [];
  let counter = 0, totalCount = 0, numID = 0;

  let batch = writeBatch(db);
  recordsToAdd.forEach((newRecord:any) => {
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