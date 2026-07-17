
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-79e2a.firebaseapp.com",
  projectId: "interviewiq-79e2a",
  storageBucket: "interviewiq-79e2a.firebasestorage.app",
  messagingSenderId: "164396017786",
  appId: "1:164396017786:web:b3fcded138cd59de1333c3",
  measurementId: "G-21RXJ44WWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}