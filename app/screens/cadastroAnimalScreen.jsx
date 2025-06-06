// cadastroAnimalScreen.jsx
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for user session
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addPet } from '../index'; // Import the addPet function from your DB module (index.js)

// Custom Alert Modal Component (Replaces native Alert)
const CustomAlert = ({ message, onClose }) => {
  if (!message) return null; // Don't render if there's no message
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

// Styles for the Custom Alert Modal
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
    zIndex: 1000, // Ensure the alert is on top of other elements
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300, // Limit maximum width for larger screens
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#22C55E', // Green button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default function CadastroAnimal() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState(''); // New state for pet sex
  const [nascimento, setNascimento] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // State for custom alert message
  const [userId, setUserId] = useState(null); // State to store the logged-in user's ID

  // useEffect to fetch the userId from AsyncStorage when the component mounts
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userLoggedInId');
        if (id) {
          setUserId(parseInt(id)); // Parse ID to integer
        } else {
          // If no user is logged in, show an alert and redirect to login
          setAlertMessage('Usuário não logado. Por favor, faça login.');
          router.replace('/screens/loginScreen');
        }
      } catch (error) {
        console.error("Error fetching userId from AsyncStorage:", error);
        setAlertMessage("Erro ao carregar informações do usuário. Tente novamente.");
        router.replace('/screens/loginScreen');
      }
    };
    getUserId();
  }, []); // Empty dependency array ensures this runs only once on mount

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setNascimento(date);
    hideDatePicker();
  };

  // Function to format date for display (e.g., 12/04/2020)
  const formatarDataParaExibicao = (data) => {
    return data.toLocaleDateString('pt-BR');
  };

  // Function to format date for SQLite (YYYY-MM-DD)
  const formatarDataParaDB = (data) => {
    if (!data) return null;
    const year = data.getFullYear();
    const month = (data.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = data.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSalvar = async () => {
    if (!userId) {
      setAlertMessage('Erro: ID do usuário não encontrado. Faça login novamente.');
      return;
    }
    // Validate all required fields, including new 'sexo' field
    if (!nome || !especie || !raca || !nascimento || !sexo) {
      setAlertMessage('Por favor, preencha todos os campos (Nome, Espécie, Raça, Sexo, Data de Nascimento).');
      return;
    }

    try {
      // Format date for database storage
      const formattedDateOfBirth = formatarDataParaDB(nascimento);

      // Call addPet function from your DB module
      const petId = await addPet(
        userId,
        nome,
        especie,
        raca,
        sexo,
        formattedDateOfBirth,
        null // image_uri is null for now, can be updated later
      );

      if (petId) {
        setAlertMessage('Animal cadastrado com sucesso!');
        // Clear form fields after successful save
        setNome('');
        setEspecie('');
        setRaca('');
        setSexo('');
        setNascimento(null);
        // Optional: navigate to the list of pets or pet detail screen after a short delay
        setTimeout(() => {
          setAlertMessage(''); // Clear alert message before navigating
          router.replace('/screens/listpetScreen'); // Redirect to pet list
        }, 1500);
      } else {
        setAlertMessage('Erro ao cadastrar animal. Tente novamente.');
      }
    } catch (error) {
      console.error('Error saving animal:', error);
      setAlertMessage('Ocorreu um erro ao salvar o animal: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Render the custom alert component */}
      <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />

      <Text style={styles.title}>Cadastrar Animal</Text>

      <Text style={styles.label}>Nome do animal</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Totó"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Espécie</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Cachorro"
        value={especie}
        onChangeText={setEspecie}
      />

      <Text style={styles.label}>Raça</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Poodle"
        value={raca}
        onChangeText={setRaca}
      />
      
      <Text style={styles.label}>Sexo (Macho/Fêmea)</Text> {/* New input for sex */}
      <TextInput
        style={styles.input}
        placeholder="Ex: Macho"
        value={sexo}
        onChangeText={setSexo}
        autoCapitalize="words" // Capitalize first letter
      />

      <Text style={styles.label}>Data de nascimento</Text>
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text style={{ color: nascimento ? '#000' : '#999' }}>
          {nascimento ? formatarDataParaExibicao(nascimento) : 'Ex: 12/04/2020'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()} // Prevents selecting future dates
        locale="pt-BR" // Set locale for Brazilian Portuguese date format
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 12,
    color: '#555',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    // Added for TouchableOpacity to behave like TextInput (visual consistency)
    justifyContent: 'center',
    minHeight: 50, // Ensure height for the TouchableOpacity
  },
  button: {
    backgroundColor: '#4CAF50', // Green button
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
