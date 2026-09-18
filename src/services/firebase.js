import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
const app = hasFirebaseConfig ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

export const firebaseEnabled = hasFirebaseConfig;

export function subscribeToAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export function signIn(email, password) {
  if (!auth) throw new Error('Firebase is not configured yet.');
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUp(email, password) {
  if (!auth) throw new Error('Firebase is not configured yet.');
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logOut() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export function subscribeToUserData(userId, callback) {
  if (!db) return () => {};

  return onSnapshot(doc(db, 'users', userId), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}

export function saveUserData(userId, data) {
  if (!db) return Promise.resolve();
  return setDoc(doc(db, 'users', userId), data, { merge: true });
}
