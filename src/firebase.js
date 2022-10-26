import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs,
  query, where, setDoc, doc, addDoc, updateDoc, deleteDoc
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { computed, onUnmounted, ref } from 'vue';

import { firebaseConfig } from '@/../sConfig.js';

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const collectRef = collection(db, 'records');
const collectRefNotes = collection(db, 'songNotes');

export function useAuth() {
  const user = ref(null);
  const isLogin = computed(() => {
    return user.value !== null;
  });
  const unsubscribe = onAuthStateChanged(auth, (_user) => {
    user.value = _user;
  });
  onUnmounted(unsubscribe);

  const signInEmail = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        console.log(err.message);
      });
  };

  const signOutUser = () => {
    signOut(auth)
      .catch((err) => {
        console.log(err.message);
      });
  };

  return {
    user, isLogin,
    signOutUser, signInEmail
  };
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

export async function getBestRecordsDB(userUID, trackerMode){
  let tracker = trackerMode == 'ap' ? "bestPerf" : "bestCB";
  const q = query(collectRef, where("userUID","==",userUID), where(tracker,"==",true));
  const snapshot = await getDocs(q);

  const bestRecords = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return bestRecords;
}

export async function getSongRecords(userUID, songID, songDifficulty){
  if (!userUID){ return null; }

  const q = query(collectRef,
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

  const q = query(collectRefNotes, where("userUID","==",userUID), where("songID","==",parseInt(songID)));
  const snapshot = await getDocs(q);

  const songNote = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return songNote[0] ?? null;
}

export async function setSongNote(userUID, songID, songNote, noteID){
  if (!userUID){ return null; }

  if (!noteID){
    const newNote = await addDoc(collection(db, "songNotes"), {
      note: songNote,
      songID: parseInt(songID),
      userUID: userUID
    });
    return newNote.id;
  }else{
    await setDoc(doc(db,"songNotes", noteID), {
      note: songNote,
      songID: parseInt(songID),
      userUID: userUID
    });
    return noteID;
  }
}

export async function updateBestRecord(userUID, oldRecordID, trackerMode){
  if (!userUID || !oldRecordID){ return null; }

  if (trackerMode == 'ap'){
    await updateDoc(doc(db,"records", oldRecordID), {
      bestPerf: false
    });
  }else if (trackerMode == 'fc'){
    await updateDoc(doc(db,"records", oldRecordID), {
      bestCB: false
    });
  }
  return oldRecordID;
}

export async function updateNewBestRecord(userUID, oldRecord, trackerMode){
  if (!userUID || !oldRecord){ return null; }

  let records = (await getSongRecords(userUID, oldRecord.songID, oldRecord.difficulty))
    .map(i => {
      return {
        ...i,
        breaks: i.good + i.bad + i.miss,
        nonperfs: i.great + i.good + i.bad + i.miss
      }
    });

  let trackMode = 'nonperfs';
  if (trackerMode == 'fc'){
    trackMode = 'breaks';
  }

  records.sort((a,b) => {
    if (a[trackMode] - b[trackMode] != 0){
      return a[trackMode] - b[trackMode];
    }
    return (new Date(a.date) - new Date(b.date));
  });

  let newRecordID = records[1]?.id;
  if (!newRecordID) { return; }

  if (trackerMode == 'ap'){
    await updateDoc(doc(db,"records", newRecordID), {
      bestPerf: true
    });
  }else if (trackerMode == 'fc'){
    await updateDoc(doc(db,"records", newRecordID), {
      bestCB: true
    });
  }
}

export async function addNewRecord(userUID, newRecord){
  if (!userUID){ return null; }

  await addDoc(collection(db, "records"), {
    ...newRecord,
    userUID: userUID
  });
}

export async function deleteRecordDB(userUID, delRecord){
  if (!userUID){ return null; }

  await deleteDoc(doc(db,"records",delRecord.id));
}