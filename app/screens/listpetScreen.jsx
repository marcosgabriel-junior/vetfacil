import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from '../services/_firebaseconfig';
import { deletePet } from '../services/_firebaseServices';

//  Modal de confirmação personalizado
const ConfirmationModal = ({ visible, petName, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Confirmar Exclusão</Text>
          <Text style={modalStyles.message}>
            Tem certeza que deseja excluir <Text style={{ fontWeight: 'bold' }}>{petName}</Text>?{'\n'}Todos os agendamentos associados também serão apagados.
          </Text>
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity onPress={onCancel} style={[modalStyles.button, modalStyles.cancelButton]}>
              <Text style={modalStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[modalStyles.button, modalStyles.confirmButton]}>
              <Text style={[modalStyles.buttonText, { color: 'white' }]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Pet() {
  const router = useRouter();
  const isFocused = useIsFocused();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar o modal de confirmação
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userLoggedInId');
      if (userId) {
        const petsQuery = query(collection(db, 'pets'), where('donoid', '==', userId));
        const querySnapshot = await getDocs(petsQuery);
        const petsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPets(petsData);
      }
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPets();
    }
  }, [isFocused]);

  // Função que ABRE o modal de confirmação
  const handleDeletePet = (petId, petName) => {
    setPetToDelete({ id: petId, name: petName });
    setIsConfirmingDelete(true);
  };

  // Função que EXECUTA a exclusão após a confirmação
  const onConfirmDelete = async () => {
    if (!petToDelete) return;

    const result = await deletePet(petToDelete.id);
    
    // Fecha o modal
    setIsConfirmingDelete(false);

    if (result.success) {
      Alert.alert("Sucesso", `${petToDelete.name} foi excluído.`);
      setPetToDelete(null); // Limpa o estado
      fetchPets(); // Recarrega a lista de pets
    } else {
      Alert.alert("Erro", result.error);
      setPetToDelete(null); // Limpa o estado
    }
  };

  return (
    <View style={styles.container}>
      <ConfirmationModal
        visible={isConfirmingDelete}
        petName={petToDelete?.name}
        onConfirm={onConfirmDelete}
        onCancel={() => setIsConfirmingDelete(false)}
      />

      <View style={styles.header}>
        <Text style={styles.titulo}>Meus Pets</Text>
        <TouchableOpacity onPress={() => router.push('/screens/cadastroAnimalScreen')}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={{ width: "95%" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#22C55E" style={{ marginTop: 50 }} />
        ) : pets.length > 0 ? (
          pets.map(pet => (
            <View key={pet.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardClickableArea}
                onPress={() => router.push(`/screens/petScreen?petId=${pet.id}`)}
              >
                <Image
                  source={pet.image_uri ? { uri: pet.image_uri } : require("../../assets/images/Logo02.png")}
                  style={styles.fotoPet}
                />
                <View style={styles.infoPet}>
                  <Text style={styles.nomePet}>{pet.name}</Text>
                  <Text style={styles.tipoPet}>{pet.species}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePet(pet.id, pet.name)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#6B7280' }}>
            Você ainda não cadastrou nenhum pet.
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.botao} onPress={() => router.push('/screens/cadastroAnimalScreen')}>
        <Text style={styles.botaoTexto}>＋ Adicionar Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addIcon: {
    fontSize: 24,
    color: "#333",
  },
  card: {
    width: "100%", 
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardClickableArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fotoPet: {
    width: 55,
    height: 55,
    borderRadius: 55,
    marginRight: 12,
  },
  infoPet: {
    justifyContent: "center",
  },
  nomePet: {
    fontSize: 16,
    fontWeight: "600",
  },
  tipoPet: {
    fontSize: 14,
    color: "#6B7280",
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 22,
  },
  botao: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#22C55E",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// Estilos para o novo modal de confirmação
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 320,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#EF4444', // Vermelho para exclusão
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
