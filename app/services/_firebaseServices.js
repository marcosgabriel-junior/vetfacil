import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from './_firebaseconfig.js';

// ... (função cadastrarUsuario)
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


// ... (função getEventsByPetId)
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

// ... (função getAllEventsByUserId)
export const getAllEventsByUserId = async (userId) => {
  if (!userId) {
    console.log("getAllEventsByUserId: userId não fornecido.");
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
    console.error("deletePet: petId não fornecido.");
    return { success: false, error: "ID do pet não fornecido." };
  }

  try {
    // 1. Excluir todos os eventos associados ao pet.
    const eventsQuery = query(collection(db, "events"), where("pet_id", "==", petId));
    const eventsSnapshot = await getDocs(eventsQuery);
    
    // Deleta cada evento em um lote para otimizar.
    const deletePromises = [];
    eventsSnapshot.forEach((eventDoc) => {
      deletePromises.push(deleteDoc(eventDoc.ref));
    });
    await Promise.all(deletePromises);
    console.log(`Eventos associados ao pet ${petId} excluídos.`);

    // 2. Excluir o documento do pet.
    await deleteDoc(doc(db, 'pets', petId));
    console.log(`Pet ${petId} excluído com sucesso.`);

    return { success: true };

  } catch (error) {
    console.error("Erro ao excluir o pet:", error);
    return { success: false, error: "Ocorreu um erro ao excluir o pet." };
  }
};
