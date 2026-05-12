import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_vpg1asToZnyhckhnhHfOW5h225uvLtI",
  authDomain: "web-dev-de3b6.firebaseapp.com",
  projectId: "web-dev-de3b6",
  storageBucket: "web-dev-de3b6.firebasestorage.app",
  messagingSenderId: "538943172317",
  appId: "1:538943172317:web:8c05e2b2a5923552127534",
  measurementId: "G-NLH9GC1Y40",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();