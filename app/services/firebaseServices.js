// VETFACIL/app/services/firebaseServices.js

// ... (seus imports e outras funções como getPetById, getEventsByPetId)
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ajuste o caminho se necessário


// Funções getPetById e getEventsByPetId (já fornecidas anteriormente)
// ...

/**
 * Busca todos os eventos para todos os pets de um usuário específico.
 * Inclui o nome do pet em cada evento.
 * @param {string} userId O ID do usuário logado (UID do Firebase Auth).
 * @returns {Promise<Array<object>>} Uma lista consolidada de todos os eventos com nomes de pets.
 */
export const getAllEventsByUserId = async (userId) => {
  try {
    const petsRef = collection(db, 'pets');
    // Busque todos os pets que o usuário possui
    // Assumimos que o campo que vincula o pet ao usuário é 'donoid'
    const userPetsQuery = query(petsRef, where('donoid', '==', userId)); 
    const userPetsSnapshot = await getDocs(userPetsQuery);

    const petIds = [];
    const petNames = {}; // Para mapear petId para petName
    userPetsSnapshot.forEach(doc => {
      petIds.push(doc.id);
      petNames[doc.id] = doc.data().name; // Armazena o nome do pet
    });

    if (petIds.length === 0) {
      console.log("Nenhum pet encontrado para o usuário:", userId);
      return []; // Retorna array vazio se não houver pets
    }

    const eventsRef = collection(db, 'events');
    // Busque todos os eventos onde 'pet_id' está na lista de IDs dos pets do usuário
    // O operador 'in' pode ter no máximo 10 valores
    const eventsQuery = query(eventsRef, where('pet_id', 'in', petIds)); 
    const eventsSnapshot = await getDocs(eventsQuery);

    const events = [];
    eventsSnapshot.forEach(doc => {
      const eventData = doc.data();
      // Adiciona o nome do pet ao objeto do evento antes de retornar
      events.push({ 
        id: doc.id, 
        ...eventData,
        pet_name: petNames[eventData.pet_id] // Busca o nome do pet
      });
    });

    return events;
  } catch (error) {
    console.error("Erro ao buscar todos os eventos por userId:", error);
    throw error;
  }
};
//testegithub