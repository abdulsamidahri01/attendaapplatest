
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUGCFwHPLzgtV_JvzHHesFW7YGc9oEhXc",
  authDomain: "attendawebapp.firebaseapp.com",
  projectId: "attendawebapp",
  storageBucket: "attendawebapp.firebasestorage.app",
  messagingSenderId: "323275992319",
  appId: "1:323275992319:web:70ee3a0b8bbcbfa66670ca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
