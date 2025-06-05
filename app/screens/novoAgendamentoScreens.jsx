// novoAgendamentoScreens.jsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importa useLocalSearchParams
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addEvent } from '../index'; // Importa a função do seu DB

// Componente de Modal Customizada para substituir Alert
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default function NovoAgendamentoScreen() { // Renomeado para consistência
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params?.petId; // Obtém o petId dos parâmetros da rota

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!petId) {
      setAlertMessage("Erro: ID do pet não fornecido. Retornando à lista de pets.");
      setTimeout(() => router.replace('/screens/listpetScreen'), 1500);
    }
  }, [petId]);


  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // No iOS o picker não fecha automaticamente
    setData(currentDate);
  };

  const formatarDataParaDB = (data) => {
    const year = data.getFullYear();
    const month = (data.getMonth() + 1).toString().padStart(2, '0');
    const day = data.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatarHoraParaDB = (data) => {
    const hours = data.getHours().toString().padStart(2, '0');
    const minutes = data.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const salvarEvento = async () => {
    if (!petId) {
      setAlertMessage("Erro: ID do pet não encontrado para salvar o evento.");
      return;
    }
    if (!eventName || !eventType || !location || !date) {
      setAlertMessage("Preencha todos os campos obrigatórios (Nome do evento, Tipo, Local, Data/Hora).");
      return;
    }

    try {
      const formattedDate = formatarDataParaDB(date);
      const formattedTime = formatarHoraParaDB(date);

      const eventInsertId = await addEvent(
        parseInt(petId), // Garante que é um número inteiro
        eventName,
        eventType,
        location,
        notes,
        formattedDate,
        formattedTime
      );

      if (eventInsertId) {
        setAlertMessage("Evento salvo com sucesso!");
        // Limpa os campos após salvar
        setEventName("");
        setEventType("");
        setLocation("");
        setNotes("");
        setData(new Date()); // Reseta a data para a atual
        setTimeout(() => {
          setAlertMessage('');
          router.goBack(); // Volta para a tela anterior (petScreen)
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
        placeholder="Nome do evento (ex: Vacina, Tosa)"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo (Vacina, Consulta, etc)"
        value={eventType}
        onChangeText={setEventType}
      />
      <TextInput
        style={styles.input}
        placeholder="Local (ex: Clínica Veterinária XYZ)"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Motivo / Observação"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>
          Escolher Data e Hora: {date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          locale="pt-BR"
        />
      )}

      <TouchableOpacity style={styles.button} onPress={salvarEvento}>
        <Text style={styles.buttonText}>Salvar Evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    justifyContent: 'center',
    minHeight: 50,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});
