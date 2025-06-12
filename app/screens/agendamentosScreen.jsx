import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteEvent, getAllEventsByUserId } from '../services/_firebaseServices';

const ConfirmationModal = ({ visible, eventName, onConfirm, onCancel }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Confirmar Exclusão</Text>
          <Text style={modalStyles.message}>
            Tem certeza que deseja excluir o agendamento <Text style={{ fontWeight: 'bold' }}>
              "{eventName}"
            </Text>?
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

export default function Agendamentos() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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

  const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return 'Data desconhecida';
    const date = firestoreTimestamp.toDate ? firestoreTimestamp.toDate() : new Date(firestoreTimestamp);
    return date.toLocaleDateString('pt-BR');
  };

  const loadAllEvents = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const allEvents = await getAllEventsByUserId(userId);
      console.log("Eventos recebidos:", allEvents);

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcoming = [];
      const past = [];

      allEvents.forEach(event => {
        const eventDateTime = event.event_date?.toDate ? event.event_date.toDate() : new Date(`${event.event_date}T${event.event_time}`);
        eventDateTime.setHours(0, 0, 0, 0);
        if (eventDateTime >= now) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      });

      upcoming.sort((a, b) => (a.event_date?.toDate() || 0) - (b.event_date?.toDate() || 0));
      past.sort((a, b) => (b.event_date?.toDate() || 0) - (a.event_date?.toDate() || 0));

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      Alert.alert("Erro", "Não foi possível carregar seus agendamentos.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userLoggedInId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useFocusEffect(useCallback(() => {
    loadAllEvents();
  }, [loadAllEvents]));

  const handleDeleteEvent = (eventId, eventName) => {
    setEventToDelete({ id: eventId, name: eventName });
    setIsConfirmingDelete(true);
  };

  const onConfirmDelete = async () => {
    if (!eventToDelete) return;
    const result = await deleteEvent(eventToDelete.id);
    setIsConfirmingDelete(false);
    if (result.success) {
      Alert.alert("Sucesso", "Agendamento excluído.");
      setEventToDelete(null);
      loadAllEvents();
    } else {
      Alert.alert("Erro", result.error);
      setEventToDelete(null);
    }
  };

  const renderEventCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconeBox}>
          <Image source={getIconForEventType(item.event_type || item.event_name)} style={styles.icone} />
        </View>
        <View style={styles.info}>
          <Text style={styles.tituloCard}>{item.event_name}</Text>
          <Text style={styles.subtituloCard}>Tipo: {item.event_type}</Text>
          <Text style={styles.subtituloCard}>Pet: {item.pet_name}</Text>
          <Text style={styles.subtituloCard}>Local: {item.location}</Text>
          <Text style={styles.subtituloCard}>Observações: {item.notes}</Text>
          <Text style={styles.subtituloCard}>Data: {formatDate(item.event_date)} às {item.event_time}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDeleteEvent(item.id, item.event_name)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ConfirmationModal
        visible={isConfirmingDelete}
        eventName={eventToDelete?.name}
        onConfirm={onConfirmDelete}
        onCancel={() => setIsConfirmingDelete(false)}
      />

      <ScrollView>
        <Text style={styles.titulo}>Agendamentos</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#22C55E" style={{ marginTop: 50 }} />
        ) : (
          <>
            <Text style={styles.subtitulo}>Próximos</Text>
            {upcomingEvents.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum agendamento futuro.</Text>
            ) : (
              <FlatList data={upcomingEvents} keyExtractor={(item) => item.id} renderItem={renderEventCard} scrollEnabled={false} />
            )}

            <Text style={styles.subtitulo}>Passados</Text>
            {pastEvents.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum agendamento passado.</Text>
            ) : (
              <FlatList data={pastEvents} keyExtractor={(item) => item.id} renderItem={renderEventCard} scrollEnabled={false} />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#FFFFFF" },
  titulo: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 16 },
  subtitulo: { fontSize: 16, fontWeight: "600", color: "#1F2937", marginTop: 20, marginBottom: 12 },
  card: { flexDirection: "row", alignItems: "center", justifyContent: 'space-between', backgroundColor: "#F0F4F7", borderRadius: 12, padding: 12, marginBottom: 12 },
  cardContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconeBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginRight: 12 },
  icone: { width: 24, height: 24 },
  info: { flex: 1 },
  tituloCard: { fontSize: 16, fontWeight: "600" },
  subtituloCard: { fontSize: 14, color: "#6B7280" },
  deleteButton: { paddingLeft: 10 },
  deleteButtonText: { fontSize: 22 },
  emptyText: { fontSize: 15, color: '#666', textAlign: 'center', marginTop: 10, marginBottom: 10 }
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', maxWidth: 320, backgroundColor: 'white', borderRadius: 12, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#E5E7EB' },
  confirmButton: { backgroundColor: '#EF4444' },
  buttonText: { fontSize: 16, fontWeight: 'bold' }
});