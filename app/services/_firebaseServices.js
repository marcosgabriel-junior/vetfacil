import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where, addDoc, Timestamp } from 'firebase/firestore'; // Adicionado updateDoc
import { auth, db} from './_firebaseconfig.js';


export async function addEvent(eventData, userId) {
  try {
    const newEvent = {
      ...eventData,
      user_id: userId,
      created_at: new Date()
    };

    const docRef = await addDoc(collection(db, 'events'), newEvent);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar evento:", error);
    return { success: false, error: error.message };
  }
}


//Adicionando eventos

// ... (suas funções existentes como cadastrarUsuario, etc.)
export const cadastrarUsuario = async (nome, email, senha) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      name: nome,
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
  if (!userId) return [];

  try {
    // Pega os pets do usuário
    const petsSnapshot = await getDocs(
      query(collection(db, "pets"), where("donoid", "==", userId))
    );
    if (petsSnapshot.empty) return [];

    const petIds = [];
    petsSnapshot.docs.forEach(doc => petIds.push(doc.id));

    const events = [];
    const chunks = [];
    const chunkSize = 10;
    for (let i = 0; i < petIds.length; i += chunkSize) {
      chunks.push(petIds.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      const eventsSnapshot = await getDocs(
        query(collection(db, "events"), where("pet_id", "in", chunk))
      );
      eventsSnapshot.docs.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
      });
    }

    return events;
  } catch (err) {
    console.error("Erro getAllEventsByUserId:", err);
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
    const petsQuery = query(collection(db, 'pets'), where("donoid", "==", userId));
    const petsSnapshot = await getDocs(petsQuery);
    const petIds = petsSnapshot.docs.map(doc => doc.id);
    if (petIds.length > 0) {
      const eventsQuery = query(collection(db, "events"), where("pet_id", "in", petIds));
      const eventsSnapshot = await getDocs(eventsQuery);
      const deleteEventPromises = eventsSnapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deleteEventPromises);
    }
    const deletePetPromises = petsSnapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePetPromises);
    await deleteDoc(doc(db, 'users', userId));
    await deleteUser(user);
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
export const deleteEvent = async (eventId) => {
  if (!eventId) {
    return { success: false, error: "ID do agendamento não fornecido." };
  }
  try {
    await deleteDoc(doc(db, "events", eventId));
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir o evento:", error);
    return { success: false, error: "Ocorreu um erro ao excluir o agendamento." };
  }
};
export const updatePetImage = async (petId, imageUrl) => {
  if (!petId) {
    return { success: false, error: "ID do pet não fornecido." };
  }
  try {
    const petRef = doc(db, 'pets', petId);
    await updateDoc(petRef, {
      image_uri: imageUrl
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar a imagem do pet:", error);
    return { success: false, error: "Ocorreu um erro ao salvar a imagem." };
  }
};

/**
 * NOVA FUNÇÃO
 * Atualiza a URL da foto de perfil de um usuário no Firestore.
 */
export const updateUserProfileImage = async (userId, imageUrl) => {
  if (!userId) {
    return { success: false, error: "ID do usuário não fornecido." };
  }
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      photoURL: imageUrl // Campo para a foto do usuário
    });
    console.log(`Imagem do usuário ${userId} atualizada.`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar a foto do perfil:", error);
    return { success: false, error: "Ocorreu um erro ao salvar a foto." };
  }
};
