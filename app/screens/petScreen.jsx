// petScreen.jsx
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from '../services/firebaseconfig';

export default function PetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params?.petId; // Obtém o petId dos parâmetros da rota (Firestore ID é string)

  const [petDetails, setPetDetails] = useState(null);
  const [petEvents, setPetEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para calcular a idade
  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return "Idade desconhecida";
    const birthDateValue = dateOfBirth.toDate ? dateOfBirth.toDate() : new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDateValue.getFullYear();
    const m = today.getMonth() - birthDateValue.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateValue.getDate())) {
      age--;
    }
    return `${age} anos`;
  };

  // Mapeia os tipos de evento para os ícones
  const getIconForEventType = (eventType) => {
    const type = eventType ? eventType.toLowerCase() : '';
    if (type.includes('vacina') || type.includes('veterinário') || type.includes('consulta')) {
      return require("../../assets/images/seringa.png");
    }
    if (type.includes('tosa') || type.includes('banho')) {
      return require("../../assets/images/tesouras.png");
    }
    return require("../../assets/images/seringa.png"); // Ícone padrão se nenhum for correspondido
  };

  // Funções para buscar dados do Firestore (podem ser movidas para um arquivo de serviços/DB)
  const getPetByIdFirestore = async (id) => {
    try {
      const petRef = doc(db, 'pets', id);
      const petSnap = await getDoc(petRef);
      if (petSnap.exists()) {
        return { id: petSnap.id, ...petSnap.data() };
      } else {
        console.log("No such document (pet)!");
        return null;
      }
    } catch (error) {
      console.error("Error getting pet document:", error);
      throw error;
    }
  };

  const getEventsByPetIdFirestore = async (id) => { // id continua sendo o ID do documento do pet
    try {
      const eventsColRef = collection(db, 'events');
      // O campo na query é 'pet_id' (com underscore), conforme a sua estrutura de DB
      const q = query(eventsColRef, where('pet_id', '==', id)); 
      const querySnapshot = await getDocs(q);
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      return events;
    } catch (error) {
      console.error("Error getting events by pet ID:", error);
      throw error;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadPetData = async () => {
        setLoading(true);
        if (!petId) {
          Alert.alert("Erro", "ID do pet não fornecido.");
          router.replace('/screens/listpetScreen');
          setLoading(false);
          return;
        }
        try {
          const details = await getPetByIdFirestore(petId); 
          if (details) {
            setPetDetails(details);
          } else {
            Alert.alert("Erro", "Pet não encontrado.");
            router.replace('/screens/listpetScreen');
            setLoading(false);
            return;
          }

          const events = await getEventsByPetIdFirestore(petId); // Chama com petId
          setPetEvents(events);

        } catch (error) {
          console.error("Erro ao carregar dados do pet:", error);
          Alert.alert("Erro", "Não foi possível carregar os dados do pet.");
        } finally {
          setLoading(false);
        }
      };
      loadPetData();
      return () => {};
    }, [petId])
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={{marginTop: 10}}>Carregando informações do pet...</Text>
      </View>
    );
  }

  if (!petDetails) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Não foi possível carregar os detalhes do pet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 80 }}>
        <Image 
          source={petDetails.image_uri ? { uri: petDetails.image_uri } : require("../../assets/images/dog1.jpeg")} 
          style={styles.fotoPet} 
        />
        <Text style={styles.nomePet}>{petDetails.name}</Text>
        <Text style={styles.descricaoPet}>
          {petDetails.breed || 'Raça desconhecida'}
          {"\n"}
          {petDetails.sex || 'Gênero desconhecido'}, {getAge(petDetails.date_of_birth)}
        </Text>
        <Text style={styles.upcoming}>Próximos Eventos</Text>
        {petEvents.length === 0 ? (
          <Text style={styles.noEventsText}>Nenhum evento futuro agendado para este pet.</Text>
        ) : (
          petEvents.map((event) => (
            <View style={styles.card} key={event.id}>
              <Image source={getIconForEventType(event.event_type || event.event_name)} style={styles.icone} />
              <View>
                <Text style={styles.tituloCard}>{event.event_name}</Text>
                <Text style={styles.subtituloCard}>
                  {event.event_date?.toDate ? new Date(event.event_date.toDate()).toLocaleDateString() : event.event_date} às {event.event_time}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push({
          pathname: '/screens/novoAgendamentoScreens',
          params: { petId: petDetails.id, petName: petDetails.name }
        })}
      >
        <Text style={styles.botaoTexto}>+ Novo evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#FFFFFF", alignItems: "center", },
  fotoPet: { width: 190, height: 190, borderRadius: 90, marginVertical: 16, },
  nomePet: { fontSize: 22, fontWeight: "700", textAlign: "center", },
  descricaoPet: { fontSize: 14, color: "green", textAlign: "center", marginBottom: 24, },
  upcoming: { alignSelf: "flex-start", fontSize: 16, fontWeight: "bold", marginBottom: 12, },
  card: { width: "100%", flexDirection: "row", alignItems: "center", backgroundColor: "#F0F4F7", borderRadius: 12, padding: 12, marginBottom: 12, },
  icone: { width: 40, height: 40, marginRight: 12, },
  tituloCard: { fontSize: 16, fontWeight: "600", },
  subtituloCard: { fontSize: 14, color: "#6B7280", },
  botao: { position: 'absolute', bottom: 24, backgroundColor: "#22C55E", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '90%', alignItems: 'center', },
  botaoTexto: { color: "white", fontWeight: "bold", fontSize: 16, },
  noEventsText: { fontSize: 16, color: "#6B7280", marginTop: 10, marginBottom: 20, textAlign: 'center', }
});