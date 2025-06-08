//oi balde
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'; // Adicionado deleteUser
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from './_firebaseconfig.js';
export const cadastrarUsuario = async (nome, email, senha) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      nome: nome,
      email: email,
      uid: user.uid,
      dataCadastro: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    let friendlyMessage = 'Ocorreu um erro ao realizar o cadastro.';
    switch (error.code) {
      case 'auth/email-already-in-use':
        friendlyMessage = 'Este e-mail já está em uso por outra conta.';
        break;
      case 'auth/invalid-email':
        friendlyMessage = 'O formato do e-mail é inválido.';
        break;
      case 'auth/weak-password':
        friendlyMessage = 'A senha é muito fraca. Ela deve ter no mínimo 6 caracteres.';
        break;
      default:
        console.error("Erro não tratado no cadastro:", error);
    }
    return { success: false, error: friendlyMessage };
  }
};

// ... (as outras funções de serviço como getEventsByPetId, getAllEventsByUserId, deletePet permanecem aqui) ...
export const getEventsByPetId = async (petId) => {
    if (!petId) return [];
    try {
      const events = [];
      const q = query(collection(db, "events"), where("pet_id", "==", petId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      return events;
    } catch (error) {
      console.error("Erro ao buscar eventos do pet:", error);
      return [];
    }
  };
export const getAllEventsByUserId = async (userId) => {
  if (!userId) {
    return [];
  }
  try {
    const petsRef = collection(db, 'pets');
    const petsQuery = query(petsRef, where("donoid", "==", userId));
    const petsSnapshot = await getDocs(petsQuery);
    if (petsSnapshot.empty) {
      return [];
    }
    const petMap = new Map();
    petsSnapshot.docs.forEach(doc => {
      petMap.set(doc.id, doc.data().name);
    });
    const petIds = Array.from(petMap.keys());
    if (petIds.length === 0) return [];
    const eventsRef = collection(db, 'events');
    const eventsQuery = query(eventsRef, where("pet_id", "in", petIds));
    const eventsSnapshot = await getDocs(eventsQuery);
    const allEvents = eventsSnapshot.docs.map(eventDoc => {
      const eventData = eventDoc.data();
      return {
        id: eventDoc.id,
        ...eventData,
        pet_name: petMap.get(eventData.pet_id) || 'Pet Desconhecido'
      };
    });
    return allEvents;
  } catch (error) {
    console.error("Erro ao buscar todos os eventos do usuário:", error);
    return [];
  }
};
export const deletePet = async (petId) => {
  if (!petId) {
    return { success: false, error: "ID do pet não fornecido." };
  }
  try {
    const eventsQuery = query(collection(db, "events"), where("pet_id", "==", petId));
    const eventsSnapshot = await getDocs(eventsQuery);
    const deletePromises = [];
    eventsSnapshot.forEach((eventDoc) => {
      deletePromises.push(deleteDoc(eventDoc.ref));
    });
    await Promise.all(deletePromises);
    await deleteDoc(doc(db, 'pets', petId));
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir o pet:", error);
    return { success: false, error: "Ocorreu um erro ao excluir o pet." };
  }
};
export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, error: "Nenhum usuário logado para excluir." };
  }
  const userId = user.uid;

  try {
    // 1. Buscar e deletar todos os pets e eventos associados
    const petsQuery = query(collection(db, 'pets'), where("donoid", "==", userId));
    const petsSnapshot = await getDocs(petsQuery);
    const petIds = petsSnapshot.docs.map(doc => doc.id);

    if (petIds.length > 0) {
      // Deletar eventos
      const eventsQuery = query(collection(db, "events"), where("pet_id", "in", petIds));
      const eventsSnapshot = await getDocs(eventsQuery);
      const deleteEventPromises = eventsSnapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deleteEventPromises);
    }
    
    // Deletar pets
    const deletePetPromises = petsSnapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePetPromises);

    // 2. Deletar o documento do usuário no Firestore
    await deleteDoc(doc(db, 'users', userId));

    // 3. Deletar o usuário da Authentication
    // Esta operação pode falhar se o login não for recente.
    await deleteUser(user);

    // 4. Limpar dados locais
    await AsyncStorage.removeItem('userLoggedInId');

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    let friendlyMessage = "Ocorreu um erro ao excluir sua conta.";
    if (error.code === 'auth/requires-recent-login') {
      friendlyMessage = "Esta é uma operação sensível. Por favor, faça login novamente antes de tentar excluir sua conta.";
    }
    return { success: false, error: friendlyMessage };
  }
};
