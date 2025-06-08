import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from './_firebaseconfig.js';

/**
 * Cadastra um novo usuário e salva seus dados na coleção 'users'.
 */
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

/**
 * Busca os eventos de um único pet específico.
 */
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


/**
 * FUNÇÃO CORRIGIDA
 * Busca todos os eventos de todos os pets de um usuário.
 */
export const getAllEventsByUserId = async (userId) => {
  if (!userId) {
    console.log("getAllEventsByUserId: userId não fornecido.");
    return [];
  }

  try {
    // 1. Encontra todos os pets que pertencem ao usuário logado.
    const petsRef = collection(db, 'pets');
    const petsQuery = query(petsRef, where("donoid", "==", userId));
    const petsSnapshot = await getDocs(petsQuery);

    if (petsSnapshot.empty) {
      console.log('Nenhum pet encontrado para este usuário.');
      return [];
    }

    // Cria um mapa para associar o ID do pet ao seu nome.
    const petMap = new Map();
    petsSnapshot.docs.forEach(doc => {
      petMap.set(doc.id, doc.data().name);
    });
    const petIds = Array.from(petMap.keys());

    // 2. Busca todos os eventos onde o 'pet_id' corresponde a um dos pets encontrados.
    // A consulta 'in' é limitada a 30 itens. Para mais pets, seria necessária uma abordagem diferente.
    if (petIds.length === 0) return [];
    
    const eventsRef = collection(db, 'events');
    const eventsQuery = query(eventsRef, where("pet_id", "in", petIds));
    const eventsSnapshot = await getDocs(eventsQuery);

    // 3. Mapeia os resultados e adiciona o nome do pet a cada evento.
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