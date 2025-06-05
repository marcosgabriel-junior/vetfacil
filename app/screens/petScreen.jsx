// petScreen.jsx
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getEventsByPetId, getPetById } from '../index'; // Importa funções do seu DB

export default function PetScreen() { // Renomeado para PetScreen para clareza
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params?.petId; // Obtém o petId dos parâmetros da rota

  const [petDetails, setPetDetails] = useState(null);
  const [petEvents, setPetEvents] = useState([]);

  // Função para calcular a idade
  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return "Idade desconhecida";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
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

  // Use useFocusEffect para recarregar os dados do pet e seus eventos sempre que a tela entrar em foco
  useFocusEffect(
    React.useCallback(() => {
      const loadPetData = async () => {
        if (!petId) {
          Alert.alert("Erro", "ID do pet não fornecido.");
          router.replace('/screens/listpetScreen'); // Redireciona de volta
          return;
        }
        try {
          // Carrega detalhes do pet
          const details = await getPetById(parseInt(petId));
          if (details) {
            setPetDetails(details);
          } else {
            Alert.alert("Erro", "Pet não encontrado.");
            router.replace('/screens/listpetScreen');
            return;
          }

          // Carrega eventos do pet
          const events = await getEventsByPetId(parseInt(petId));
          setPetEvents(events);

        } catch (error) {
          console.error("Erro ao carregar dados do pet:", error);
          Alert.alert("Erro", "Não foi possível carregar os dados do pet.");
        }
      };
      loadPetData();
      return () => {}; // Função de limpeza
    }, [petId]) // Recarrega se o petId mudar
  );

  if (!petDetails) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando informações do pet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Imagem do Pet */}
      <Image source={require("../../assets/images/dog1.jpeg")} style={styles.fotoPet} />

      {/* Nome, raça e idade (pegos do cadastro) */}
      <Text style={styles.nomePet}>{petDetails.name}</Text>
      <Text style={styles.descricaoPet}>
        {petDetails.breed || 'Raça desconhecida'}
        {"\n"}
        {petDetails.sex || 'Gênero desconhecido'}, {getAge(petDetails.date_of_birth)}
      </Text>

      <Text style={styles.upcoming}>Chegando</Text>

      {/* Eventos que esse pet tem */}
      {petEvents.length === 0 ? (
        <Text style={styles.noEventsText}>Nenhum evento futuro agendado para este pet.</Text>
      ) : (
        petEvents.map((event) => (
          <View style={styles.card} key={event.id}>
            <Image source={getIconForEventType(event.event_type || event.event_name)} style={styles.icone} />
            <View>
              <Text style={styles.tituloCard}>{event.event_name}</Text>
              <Text style={styles.subtituloCard}>{event.event_type} - {event.event_date} às {event.event_time}</Text>
            </View>
          </View>
        ))
      )}

      {/* Botão de adicionar evento */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push({
          pathname: '/screens/novoAgendamentoScreens',
          params: { petId: petDetails.id } // Passa o ID do pet para a tela de novo agendamento
        })}
      >
        <Text style={styles.botaoTexto}>+ Novo evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  fotoPet: {
    width: 190,
    height: 190,
    borderRadius: 90,
    marginVertical: 16,
  },
  nomePet: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  descricaoPet: {
    fontSize: 14,
    color: "green",
    textAlign: "center",
    marginBottom: 24,
  },
  upcoming: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  icone: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtituloCard: {
    fontSize: 14,
    color: "#6B7280",
  },
  botao: {
    marginTop: "auto", // Empurra o botão para o final da tela
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%', // Faz o botão ocupar a largura total
    alignItems: 'center', // Centraliza o texto do botão
  },
  botaoTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  noEventsText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 20,
  }
});
