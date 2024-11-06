import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  getDatabase,
  set,
  push,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2q1DmNBUG_ji-zxGYsUePPhN8qyEzmfQ",
  authDomain: "almotaheda-cf3e3.firebaseapp.com",
  projectId: "almotaheda-cf3e3",
  storageBucket: "almotaheda-cf3e3.firebasestorage.app",
  messagingSenderId: "846073109739",
  appId: "1:846073109739:web:66f8bee738fd0d7a68b2ae",
  measurementId: "G-X5R6M4BJ7H",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export {
  app,
  db,
  auth,
  storage,
  update,
  getDoc,
  deleteDoc,
  deleteObject,
  getDownloadURL,
  uploadBytes,
  signOut,
  database,
  set,
  push,
  onValue,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  ref,
  updateDoc,
  onAuthStateChanged,
  getAuth,
  query,
  where,
  getCountFromServer,
};
