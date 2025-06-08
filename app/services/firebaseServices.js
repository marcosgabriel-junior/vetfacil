import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from './firebaseconfig';

const auth = getAuth();

export const registerUserWithProfile = async (email, password, name, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      phone: phone,
      createdAt: new Date(),
    });

    console.log("Usuário registrado e perfil salvo:", user.uid);
    return userCredential;

  } catch (error) {
    console.error("Erro ao registrar ou salvar perfil do usuário:", error);
    throw error;
  }
};

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Usuário logado:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Erro ao fazer login do usuário:", error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log("Perfil do usuário não encontrado para o UID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error);
    throw error;
  }
};

export const getPetById = async (pet_id) => {
  try {
    const petRef = doc(db, 'pets', pet_id);
    const petSnap = await getDoc(petRef);

    if (petSnap.exists()) {
      return { id: petSnap.id, ...petSnap.data() };
    } else {
      console.log("Nenhum documento de pet encontrado com o ID:", pet_id);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do pet:", error);
    throw error;
  }
};

export const getEventsByPetId = async (pet_id) => {
  try {
    const eventsColRef = collection(db, 'events');
    const q = query(eventsColRef, where('pet_id', '==', pet_id));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return events;
  } catch (error) {
    console.error("Erro ao buscar eventos do pet:", error);
    throw error;
  }
};

export const getAllEventsByUserId = async (userId) => {
  try {
    const petsRef = collection(db, 'pets');
    const userPetsQuery = query(petsRef, where('donoid', '==', userId));
    const userPetsSnapshot = await getDocs(userPetsQuery);

    const petIds = [];
    const petNames = {};
    userPetsSnapshot.forEach(doc => {
      petIds.push(doc.id);
      petNames[doc.id] = doc.data().name;
    });

    if (petIds.length === 0) {
      console.log("Nenhum pet encontrado para o usuário:", userId);
      return [];
    }

    const eventsRef = collection(db, 'events');
    const eventsQuery = query(eventsRef, where('pet_id', 'in', petIds));
    const eventsSnapshot = await getDocs(eventsQuery);

    const events = [];
    eventsSnapshot.forEach(doc => {
      const eventData = doc.data();
      events.push({
        id: doc.id,
        ...eventData,
        pet_name: petNames[eventData.pet_id]
      });
    });

    return events;
  } catch (error) {
    console.error("Erro ao buscar todos os eventos por userId:", error);
    throw error;
  }
};