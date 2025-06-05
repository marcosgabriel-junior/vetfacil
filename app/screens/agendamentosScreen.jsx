// agendamentosScreen.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { getAllEventsByUserId } from '../index'; // Importa a função

export default function Agendamentos() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userLoggedInId');
        if (id) {
          setUserId(parseInt(id));
        } else {
          Alert.alert("Erro", "Usuário não logado.");
          // Opcional: redirecionar para a tela de login
        }
      } catch (error) {
        console.error("Erro ao carregar userId:", error);
      }
    };
    fetchUserId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadAllEvents = async () => {
        if (userId) {
          try {
            const allEvents = await getAllEventsByUserId(userId);
            const now = new Date();
            const upcoming = [];
            const past = [];

            allEvents.forEach(event => {
              // Converte a string de data e hora para um objeto Date para comparação
              const [year, month, day] = event.event_date.split('-').map(Number);
              const [hours, minutes] = event.event_time.split(':').map(Number);
              const eventDateTime = new Date(year, month - 1, day, hours, minutes);

              if (eventDateTime >= now) {
                upcoming.push(event);
              } else {
                past.push(event);
              }
            });

            // Ordena eventos futuros por data/hora crescente
            upcoming.sort((a, b) => {
                const dateA = new Date(`${a.event_date}T${a.event_time}`);
                const dateB = new Date(`${b.event_date}T${b.event_time}`);
                return dateA - dateB;
            });

            // Ordena eventos passados por data/hora decrescente
            past.sort((a, b) => {
                const dateA = new Date(`${a.event_date}T${a.event_time}`);
                const dateB = new Date(`${b.event_date}T${b.event_time}`);
                return dateB - dateA;
            });


            setUpcomingEvents(upcoming);
            setPastEvents(past);

          } catch (error) {
            console.error("Erro ao carregar todos os eventos:", error);
            Alert.alert("Erro", "Não foi possível carregar seus agendamentos.");
          }
        }
      };
      loadAllEvents();
      return () => {}; // Função de limpeza
    }, [userId])
  );

  const renderEventCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconeBox}>
        <Image source={getIconForEventType(item.event_type || item.event_name)} style={styles.icone} />
      </View>
      <View style={styles.info}>
        <Text style={styles.tituloCard}>{item.event_name}</Text>
        <Text style={styles.subtituloCard}>{item.event_type} - Pet: {item.pet_name}</Text>
      </View>
      <Text style={styles.data}>{item.event_date.split('-').reverse().join('/')} às {item.event_time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Text style={styles.titulo}>Agendamentos</Text>

      {/* Seção Próximos */}
      <Text style={styles.subtitulo}>Próximos</Text>
      {upcomingEvents.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum agendamento futuro.</Text>
      ) : (
        <FlatList
          data={upcomingEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventCard}
          scrollEnabled={false} // Para evitar rolagem aninhada se o container principal tiver rolagem
        />
      )}

      {/* Seção Passados */}
      <Text style={styles.subtitulo}>Passados</Text>
      {pastEvents.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum agendamento passado.</Text>
      ) : (
        <FlatList
          data={pastEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventCard}
          scrollEnabled={false} // Para evitar rolagem aninhada
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 20, // Espaçamento entre seções
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  iconeBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icone: {
    width: 24,
    height: 24,
  },
  info: {
    flex: 1,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtituloCard: {
    fontSize: 14,
    color: "#6B7280",
  },
  data: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  }
});
