import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPDLzGABENjA8hUUlPWY6U_Pqc5xnun30",
  authDomain: "clodecode-74e9b.firebaseapp.com",
  projectId: "clodecode-74e9b",
  storageBucket: "clodecode-74e9b.firebasestorage.app",
  messagingSenderId: "120606135691",
  appId: "1:120606135691:web:e5123a3c8393eadc29cb8e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
