// novoAgendamentoScreens.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addEvent } from '../services/_firebaseServices';

const CustomAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <View style={alertStyles.overlay}>
      <View style={alertStyles.container}>
        <Text style={alertStyles.message}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={alertStyles.button}>
          <Text style={alertStyles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const alertStyles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  container: {
    backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center', width: '80%', maxWidth: 300,
  },
  message: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  button: {
    backgroundColor: '#22C55E', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default function NovoAgendamentoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params?.petId;

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [alertMessage, setAlertMessage] = useState('');

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userLoggedInId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const salvarEvento = async () => {
    if (!userId || !petId || !eventName || !eventType || !location || !eventDate || !eventTime) {
      setAlertMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const eventData = {
        pet_id: petId,
        event_name: eventName,
        event_type: eventType,
        location,
        notes,
        event_date: eventDate,
        event_time: eventTime
      };

      const result = await addEvent(eventData, userId);

      if (result?.success) {
        setAlertMessage("Evento salvo com sucesso!");
        setEventName("");
        setEventType("");
        setLocation("");
        setNotes("");
        setEventDate("");
        setEventTime("");
        setTimeout(() => {
          setAlertMessage('');
          router.back();
        }, 1500);
      } else {
        setAlertMessage("Erro ao salvar o evento.");
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setAlertMessage("Ocorreu um erro ao salvar o evento: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />

      <Text style={styles.titulo}>Novo Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do evento"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo do evento"
        value={eventType}
        onChangeText={setEventType}
      />
      <TextInput
        style={styles.input}
        placeholder="Local"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Data (ex: 2025-06-20)"
        value={eventDate}
        onChangeText={setEventDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora (ex: 14:30)"
        value={eventTime}
        onChangeText={setEventTime}
      />

      <TouchableOpacity style={styles.button} onPress={salvarEvento}>
        <Text style={styles.buttonText}>Salvar Evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 12,
    marginBottom: 12, borderRadius: 8, fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50', padding: 14,
    borderRadius: 8, alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: '#FFF', fontSize: 18 },
});