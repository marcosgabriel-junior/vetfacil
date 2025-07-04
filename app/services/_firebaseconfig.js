import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Esta é a variável correta com suas credenciais. O nome é "firebaseConfig".
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: ",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// A função initializeApp usa a variável "firebaseConfig" (sem underscore).
const app = initializeApp(firebaseConfig);

// Exportamos o auth e o db para serem usados em outros arquivos.
export const auth = getAuth(app);
export const db = getFirestore(app);
//a parte do backand foi feita toda escutando jorge e mateus e marilia mendonça 
