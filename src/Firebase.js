// Firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDA5_t1_RRIZ0QeYMS_JgVgpBggNEnCbgA",
  authDomain: "permit-to-work-software.firebaseapp.com",
  projectId: "permit-to-work-software",
  storageBucket: "permit-to-work-software.appspot.com",
  messagingSenderId: "759018356570",
  appId: "1:759018356570:web:06d3cadb3514307a15fd63"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export const imageDb = getStorage(app);
export { auth, db };
