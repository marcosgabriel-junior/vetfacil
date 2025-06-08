import { FontAwesome } from '@expo/vector-icons'; // Importa ícones
import * as ImagePicker from 'expo-image-picker'; // Importa o seletor de imagens
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { db } from '../services/_firebaseconfig';
import { updatePetImage } from '../services/_firebaseServices.js'; // Importa a nova função

export default function PetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params?.petId;

  const [petDetails, setPetDetails] = useState(null);
  const [petEvents, setPetEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para lidar com a seleção de foto
  const handleChoosePhoto = async () => {
    // 1. Pedir permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    // 2. Abrir a galeria de imagens
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Força uma imagem quadrada
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = result.assets[0].uri;
      
      // 3. Salvar a nova URI no Firestore e atualizar a tela
      setLoading(true);
      const updateResult = await updatePetImage(petId, imageUrl);
      setLoading(false);

      if (updateResult.success) {
        setPetDetails(prevDetails => ({
          ...prevDetails,
          image_uri: imageUrl
        }));
        Alert.alert('Sucesso!', 'A foto do pet foi atualizada.');
      } else {
        Alert.alert('Erro', updateResult.error);
      }
    }
  };

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

  const getIconForEventType = (eventType) => {
    const type = eventType ? eventType.toLowerCase() : '';
    if (type.includes('vacina') || type.includes('veterinário') || type.includes('consulta')) {
      return require("../../assets/images/seringa.png");
    }
    if (type.includes('tosa') || type.includes('banho')) {
      return require("../../assets/images/tesouras.png");
    }
    return require("../../assets/images/seringa.png");
  };

  const getPetByIdFirestore = async (id) => {
    try {
      const petRef = doc(db, 'pets', id);
      const petSnap = await getDoc(petRef);
      return petSnap.exists() ? { id: petSnap.id, ...petSnap.data() } : null;
    } catch (error) {
      console.error("Error getting pet document:", error); throw error;
    }
  };

  const getEventsByPetIdFirestore = async (id) => {
    try {
      const eventsColRef = collection(db, 'events');
      const q = query(eventsColRef, where('pet_id', '==', id)); 
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting events by pet ID:", error); throw error;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadPetData = async () => {
        if (!petId) {
          Alert.alert("Erro", "ID do pet não fornecido.");
          router.replace('/screens/listpetScreen');
          return;
        }
        setLoading(true);
        try {
          const details = await getPetByIdFirestore(petId); 
          if (details) {
            setPetDetails(details);
            const events = await getEventsByPetIdFirestore(petId);
            setPetEvents(events);
          } else {
            Alert.alert("Erro", "Pet não encontrado.");
            router.replace('/screens/listpetScreen');
          }
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar os dados do pet.");
        } finally {
          setLoading(false);
        }
      };
      loadPetData();
    }, [petId])
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  if (!petDetails) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text>Não foi possível carregar os detalhes do pet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 80 }}>
        {/* Container da imagem com o botão de editar */}
        <View style={styles.imageContainer}>
          <Image 
            source={petDetails.image_uri ? { uri: petDetails.image_uri } : require("../../assets/images/dog1.jpeg")} 
            style={styles.fotoPet} 
          />
          <TouchableOpacity style={styles.editIcon} onPress={handleChoosePhoto}>
            <FontAwesome name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.nomePet}>{petDetails.name}</Text>
        <Text style={styles.descricaoPet}>
          {petDetails.breed || 'Raça desconhecida'}
          {"\n"}
          {petDetails.gender || 'Gênero desconhecido'}, {getAge(petDetails.birthdate)}
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
  // Estilo para o container da imagem
  imageContainer: {
    position: 'relative', // Necessário para posicionar o ícone sobre a imagem
    marginBottom: 16,
  },
  fotoPet: { width: 190, height: 190, borderRadius: 95, }, // Deixa o raio um pouco maior para um círculo perfeito
  // Estilo para o ícone de editar
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20, // Círculo perfeito
  },
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
