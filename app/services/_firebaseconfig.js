import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Esta é a variável correta com suas credenciais. O nome é "firebaseConfig".
const firebaseConfig = {
  apiKey: "AIzaSyD6-vCJZNOegSLJXtW3cgxd66XUrUsk8-Q",
  authDomain: "vetfacil-ec010.firebaseapp.com",
  projectId: "vetfacil-ec010",
  storageBucket: "vetfacil-ec010.appspot.com",
  messagingSenderId: "335392990884",
  appId: "1:335392990884:web:76b6c1071198cebbfea831",
  measurementId: "G-JKYS6TEGG8"
};

// A função initializeApp usa a variável "firebaseConfig" (sem underscore).
const app = initializeApp(firebaseConfig);

// Exportamos o auth e o db para serem usados em outros arquivos.
export const auth = getAuth(app);
export const db = getFirestore(app);
//a parte do backand foi feita toda escutando jorge e mateus e marilia mendonça 