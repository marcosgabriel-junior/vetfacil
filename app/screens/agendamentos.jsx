import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { getEventsByPetId } from '../services/firebaseServices'; // Ajuste o caminho se necessário

export default function Agendamentos() {
  const params = useLocalSearchParams();
  const petId = params?.petId; // Continua recebendo como petId

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapeia os tipos de evento para os ícones
  const getIconForEventType = (eventType) => {
    const type = eventType ? eventType.toLowerCase() : '';
    if (type.includes('vacina') || type.includes('veterinário') || type.includes('consulta')) {
      return require('../../assets/images/seringa.png');
    }
    if (type.includes('tosa') || type.includes('banho')) {
      return require('../../assets/images/tesouras.png');
    }
    return require('../../assets/images/seringa.png'); // Ícone padrão
  };

  // Função para formatar a data
  const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return 'Data desconhecida';
    const date = firestoreTimestamp.toDate ? firestoreTimestamp.toDate() : new Date(firestoreTimestamp);
    return date.toLocaleDateString('pt-BR');
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchEvents = async () => {
        setLoading(true);
        if (!petId) {
          console.warn("Nenhum petId fornecido para a tela de agendamentos.");
          setLoading(false);
          return;
        }
        try {
          const events = await getEventsByPetId(petId); // Passa petId, que será mapeado para pet_id na função de serviço
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          const upcoming = [];
          const past = [];

          events.forEach(event => {
            const eventDate = event.event_date?.toDate ? event.event_date.toDate() : new Date(event.event_date);
            eventDate.setHours(0, 0, 0, 0);

            if (eventDate >= now) {
              upcoming.push(event);
            } else {
              past.push(event);
            }
          });

          upcoming.sort((a, b) => {
            const dateA = a.event_date?.toDate ? a.event_date.toDate() : new Date(a.event_date);
            const dateB = b.event_date?.toDate ? b.event_date.toDate() : new Date(b.event_date);
            return dateA - dateB;
          });
          past.sort((a, b) => {
            const dateA = a.event_date?.toDate ? a.event_date.toDate() : new Date(a.event_date);
            const dateB = b.event_date?.toDate ? b.event_date.toDate() : new Date(b.event_date);
            return dateB - dateA;
          });

          setUpcomingEvents(upcoming);
          setPastEvents(past);
        } catch (error) {
          console.error("Erro ao carregar agendamentos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
      return () => {};
    }, [petId])
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={{ marginTop: 10 }}>Carregando agendamentos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Agendamentos</Text>
      <Text style={styles.subtitulo}>Próximos</Text>
      {upcomingEvents.length === 0 ? (
        <Text style={styles.noEventsText}>Nenhum agendamento futuro.</Text>
      ) : (
        upcomingEvents.map((event) => (
          <View style={styles.card} key={event.id}>
            <View style={styles.iconeBox}>
              <Image source={getIconForEventType(event.event_type || event.event_name)} style={styles.icone} />
            </View>
            <View style={styles.info}>
              <Text style={styles.tituloCard}>{event.event_name}</Text>
              <Text style={styles.subtituloCard}>{event.event_type}</Text>
            </View>
            <Text style={styles.data}>{formatDate(event.event_date)} às {event.event_time}</Text>
          </View>
        ))
      )}
      <Text style={[styles.subtitulo, { marginTop: 20 }]}>Passados</Text>
      {pastEvents.length === 0 ? (
        <Text style={styles.noEventsText}>Nenhum agendamento passado.</Text>
      ) : (
        pastEvents.map((event) => (
          <View style={styles.card} key={event.id}>
            <View style={styles.iconeBox}>
              <Image source={getIconForEventType(event.event_type || event.event_name)} style={styles.icone} />
            </View>
            <View style={styles.info}>
              <Text style={styles.tituloCard}>{event.event_name}</Text>
              <Text style={styles.subtituloCard}>{event.event_type}</Text>
            </View>
            <Text style={styles.data}>{formatDate(event.event_date)} às {event.event_time}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#FFFFFF", },
  titulo: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 16, },
  subtitulo: { fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 12, },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0F4F7", borderRadius: 12, padding: 12, marginBottom: 12, },
  iconeBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginRight: 12, },
  icone: { width: 24, height: 24, },
  info: { flex: 1, },
  tituloCard: { fontSize: 16, fontWeight: "600", },
  subtituloCard: { fontSize: 14, color: "#6B7280", },
  data: { fontSize: 14, color: "#6B7280", },
  noEventsText: { fontSize: 14, color: "#6B7280", textAlign: 'center', marginBottom: 20, }
});