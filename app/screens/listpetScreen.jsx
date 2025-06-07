import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from '../services/firebaseConfig'; // Importa a conexão com o banco de dados


export default function Pet() {
  const router = useRouter();
  const isFocused = useIsFocused();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os pets do usuário logado no Firestore
  const fetchPets = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userLoggedInId');

      // ======================= LINHA ADICIONADA PARA DEBUG =======================
      console.log("Buscando pets para o User ID:", userId);
      // =========================================================================

      if (userId) {
        // O campo 'donoId' foi alterado para 'donoid' aqui
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

  // Busca os dados sempre que a tela entra em foco
  useEffect(() => {
    if (isFocused) {
      fetchPets();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho (Mantido como o original) */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Meus Pets</Text>
        <TouchableOpacity onPress={() => router.push('/screens/cadastroAnimalScreen')}>
            <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={{ width: "95%" }}>
        {/* Lógica de Carregamento e Renderização Dinâmica */}
        {loading ? (
          <ActivityIndicator size="large" color="#22C55E" style={{ marginTop: 50 }} />
        ) : pets.length > 0 ? (
          pets.map(pet => (
            <TouchableOpacity key={pet.id} onPress={() => router.push(`/screens/petScreen?petId=${pet.id}`)}>
              <View style={styles.card}>
                <Image 
                  source={pet.image_uri ? { uri: pet.image_uri } : require("../../assets/images/Logo02.png")} 
                  style={styles.fotoPet}
                />
                <View style={styles.infoPet}>
                  <Text style={styles.nomePet}>{pet.name}</Text>
                  <Text style={styles.tipoPet}>{pet.species}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#6B7280' }}>
            Você ainda não cadastrou nenhum pet.
          </Text>
        )}
      </ScrollView>

      {/* Botão (Mantido como o original) */}
      <TouchableOpacity style={styles.botao} onPress={() => router.push('/screens/cadastroAnimalScreen')}>
        <Text style={styles.botaoTexto}>＋ Adicionar Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

// Seus estilos originais, mantidos sem nenhuma alteração
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
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
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