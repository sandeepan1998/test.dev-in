import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGP1u8jyLrCWoT4O-cFBF-VT-dcPphYaY",
  authDomain: "clodecode-25bbb.firebaseapp.com",
  projectId: "clodecode-25bbb",
  storageBucket: "clodecode-25bbb.firebasestorage.app",
  messagingSenderId: "35873304661",
  appId: "1:35873304661:web:ad3e8690ad5a7ac288e4dc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
