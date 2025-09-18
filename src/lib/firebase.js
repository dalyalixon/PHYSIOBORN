// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase de ton projet PhysioBorn
const firebaseConfig = {
  apiKey: "AIzaSyBKvZNpiAPqluqPwUlLmqGoJ7RcTpMC4XA",
  authDomain: "physioborn-273c2.firebaseapp.com",
  projectId: "physioborn-273c2",
  storageBucket: "physioborn-273c2.appspot.com", // ✅ corrigé : .appspot.com
  messagingSenderId: "719070440001",
  appId: "1:719070440001:web:c2adc28a094445116434c0",
  measurementId: "G-DBHF0GWPEF"
};

// Initialise l’app
const app = initializeApp(firebaseConfig);

// Export Firestore pour l’utiliser dans KineSite.jsx
export const db = getFirestore(app);
