import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs,
  query, where
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
const collectRefBest = collection(db, 'bestRecords');
const collectRef = collection(db, 'records');

export async function getBestRecordsDB(userUID){
  const q = query(collectRefBest, where("userUID","==",userUID));
  const snapshot = await getDocs(q);

  const bestRecords = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  // snapshot.docs.forEach((doc) => {
  //   bestRecords.push({ ...doc.data(), id: doc.id });
  // });

  return bestRecords;
}

export async function getSongRecords(userUID, songID){
  if (!userUID){
    return null;
  }
  const q = query(collectRef,  where("userUID","==",userUID), where("songID","==",parseInt(songID)));
  const snapshot = await getDocs(q);

  const songRecords = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return songRecords;
}

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