// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-agent-841ac.firebaseapp.com",
  projectId: "ai-agent-841ac",
  storageBucket: "ai-agent-841ac.firebasestorage.app",
  messagingSenderId: "360186065776",
  appId: "1:360186065776:web:8417e56ba414c28587d5b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}