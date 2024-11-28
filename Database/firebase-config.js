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
  orderBy,
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
  apiKey: "AIzaSyDr-reuVKppct8hza9oFnl8noQGXEwCY4U",
  authDomain: "unitedgroup-sa.firebaseapp.com",
  projectId: "unitedgroup-sa",
  storageBucket: "unitedgroup-sa.firebasestorage.app",
  messagingSenderId: "616560101477",
  appId: "1:616560101477:web:7a7acd96206331533f9e8c",
  measurementId: "G-1WSTR6V7F1"
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
  orderBy,
};
