// agendamentosScreen.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native"; // Adicionado ScrollView
import { getAllEventsByUserId } from '../services/_firebaseServices'; // <--- Caminho ajustado

export default function Agendamentos() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // Adicionado estado de loading

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

  // Função para formatar a data (lidando com Timestamp do Firestore)
  const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return 'Data desconhecida';
    // Converte Timestamp do Firestore para objeto Date e formata
    const date = firestoreTimestamp.toDate ? firestoreTimestamp.toDate() : new Date(firestoreTimestamp);
    return date.toLocaleDateString('pt-BR'); // Formato DD/MM/AAAA
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userLoggedInId');
        if (id) {
          // IDs do Firestore são strings. Não use parseInt a menos que você tenha certeza que o ID é um número.
          // Geralmente userLoggedInId é o UID do Firebase Auth, que é uma string.
          setUserId(id); 
        } else {
          Alert.alert("Erro", "Usuário não logado.");
          setLoading(false); // Parar loading se não houver usuário
          // Opcional: redirecionar para a tela de login
        }
      } catch (error) {
        console.error("Erro ao carregar userId:", error);
        setLoading(false); // Parar loading em caso de erro
      }
    };
    fetchUserId();
  }, []);
//teste github
  useFocusEffect(
    React.useCallback(() => {
      const loadAllEvents = async () => {
        setLoading(true); // Inicia loading ao focar na tela
        if (userId) { // Só busca se o userId estiver disponível
          try {
            const allEvents = await getAllEventsByUserId(userId);
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Para comparar apenas a data

            const upcoming = [];
            const past = [];

            allEvents.forEach(event => {
              // Ajusta a conversão da data para lidar com Timestamp do Firestore ou string de data
              const eventDateTime = event.event_date?.toDate 
                                    ? event.event_date.toDate() 
                                    : new Date(`${event.event_date}T${event.event_time}`);
              
              eventDateTime.setHours(0, 0, 0, 0); // Zera hora para comparação de "dia"

              if (eventDateTime >= now) {
                upcoming.push(event);
              } else {
                past.push(event);
              }
            });

            // Ordena eventos futuros por data/hora crescente
            upcoming.sort((a, b) => {
              const dateA = a.event_date?.toDate ? a.event_date.toDate() : new Date(`${a.event_date}T${a.event_time}`);
              const dateB = b.event_date?.toDate ? b.event_date.toDate() : new Date(`${b.event_date}T${b.event_time}`);
              return dateA - dateB;
            });

            // Ordena eventos passados por data/hora decrescente
            past.sort((a, b) => {
              const dateA = a.event_date?.toDate ? a.event_date.toDate() : new Date(`${a.event_date}T${a.event_time}`);
              const dateB = b.event_date?.toDate ? b.event_date.toDate() : new Date(`${b.event_date}T${b.event_time}`);
              return dateB - dateA;
            });

            setUpcomingEvents(upcoming);
            setPastEvents(past);

          } catch (error) {
            console.error("Erro ao carregar todos os eventos:", error);
            Alert.alert("Erro", "Não foi possível carregar seus agendamentos.");
          } finally {
            setLoading(false); // Finaliza loading em qualquer caso
          }
        } else if (userId === null) {
            // userId ainda não carregado, manter loading
        } else {
            // userId está vazio/inválido após tentativa de fetch
            setLoading(false);
        }
      };
      loadAllEvents();
      return () => {}; // Função de limpeza
    }, [userId]) // Recarrega quando userId é definido
  );

  const renderEventCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconeBox}>
        <Image source={getIconForEventType(item.event_type || item.event_name)} style={styles.icone} />
      </View>
      <View style={styles.info}>
        <Text style={styles.tituloCard}>{item.event_name}</Text>
        {/* Agora pet_name virá da função de serviço */}
        <Text style={styles.subtituloCard}>{item.event_type} - Pet: {item.pet_name || 'Desconhecido'}</Text>
      </View>
      {/* Formata a data e hora corretamente */}
      <Text style={styles.data}>{formatDate(item.event_date)} às {item.event_time}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}> {/* Usado ScrollView para conteúdo */}
      {/* Cabeçalho */}
      <Text style={styles.titulo}>Agendamentos</Text>

      {loading ? ( // Mostra ActivityIndicator enquanto carrega
        <ActivityIndicator size="large" color="#22C55E" style={{ marginTop: 50 }} />
      ) : (
        <>
          {/* Seção Próximos */}
          <Text style={styles.subtitulo}>Próximos</Text>
          {upcomingEvents.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum agendamento futuro.</Text>
          ) : (
            <FlatList
              data={upcomingEvents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderEventCard}
              scrollEnabled={false}
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
              scrollEnabled={false}
            />
          )}
        </>
      )}
    </ScrollView>
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