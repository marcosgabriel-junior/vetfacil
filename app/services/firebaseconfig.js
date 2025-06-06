// VETFACIL/vscode/app/services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6-vCJZNOegSLJXtW3cgxd66XUrUsk8-Q",
  authDomain: "vetfacil-ec010.firebaseapp.com",
  projectId: "vetfacil-ec010",
  storageBucket: "vetfacil-ec010.firebasestorage.app",
  messagingSenderId: "335392990884",
  appId: "1:335392990884:web:76b6c1071198cebbfea831",
  measurementId: "G-JKYS6TEGG8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);