import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs, onSnapshot,
  query, where, orderBy
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { computed, onUnmounted, ref, watchEffect } from 'vue';

const firebaseConfig = {
  apiKey: "AIzaSyAk2G8SPsJfvMCb_U3gLIvgxsUOU0fbEsM",
  authDomain: "miku-miku-ooeeoo.firebaseapp.com",
  projectId: "miku-miku-ooeeoo",
  storageBucket: "miku-miku-ooeeoo.appspot.com",
  messagingSenderId: "547474608748",
  appId: "1:547474608748:web:f8c6cf0ebe9f0c2bc43e49"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const collectRef = collection(db, 'bestRecords');

export async function getBestRecordsDB(userUID){
  const q = query(collectRef, where("userUID","==",userUID));
  const snapshot = await getDocs(q);

  const bestRecords = snapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  // snapshot.docs.forEach((doc) => {
  //   bestRecords.push({ ...doc.data(), id: doc.id });
  // });

  return bestRecords;
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