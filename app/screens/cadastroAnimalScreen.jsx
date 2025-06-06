// cadastroAnimalScreen.jsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ======================= MUDANÇA 1: NOVOS IMPORTS =======================
// Importar a conexão 'db' e as funções do Firestore que vamos usar
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../_layout';
// A linha "import { addPet } from '../index';" foi REMOVIDA
// ======================================================================

// O seu componente CustomAlert continua igual, sem mudanças.
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

// Seus estilos do CustomAlert continuam iguais, sem mudanças.
const alertStyles = StyleSheet.create({ /* ...seus estilos aqui... */ });

export default function CadastroAnimal() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState('');
  const [nascimento, setNascimento] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [userId, setUserId] = useState(null);

  // Seu useEffect para buscar o userId continua igual, sem mudanças.
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userLoggedInId');
        if (id) {
          setUserId(id); // Firestore usa IDs como string, então não precisa do parseInt
        } else {
          setAlertMessage('Usuário não logado. Por favor, faça login.');
          router.replace('/screens/loginScreen');
        }
      } catch (error) {
        console.error("Error fetching userId from AsyncStorage:", error);
        setAlertMessage("Erro ao carregar informações do usuário.");
        router.replace('/screens/loginScreen');
      }
    };
    getUserId();
  }, []);

  // Suas funções de date picker e formatação de data para exibição continuam iguais.
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setNascimento(date);
    hideDatePicker();
  };
  const formatarDataParaExibicao = (data) => {
    return data.toLocaleDateString('pt-BR');
  };
  // A função formatarDataParaDB foi removida pois não é mais necessária.

  const handleSalvar = async () => {
    // Sua validação de campos continua igual.
    if (!userId) {
      setAlertMessage('Erro: ID do usuário não encontrado. Faça login novamente.');
      return;
    }
    if (!nome || !especie || !raca || !nascimento || !sexo) {
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // ======================= MUDANÇA 2: LÓGICA DE SALVAR =======================
      // Em vez de chamar 'addPet', usamos 'addDoc' para salvar no Firestore.
      // A coleção no Firestore se chamará 'pets'.
      await addDoc(collection(db, 'pets'), {
        donoId: userId, // Salva o ID do dono do pet
        nome: nome,
        especie: especie,
        raca: raca,
        sexo: sexo,
        nascimento: Timestamp.fromDate(nascimento), // Salva a data no formato do Firestore
        cadastradoEm: Timestamp.now(), // Salva a data atual do cadastro
        imagemUri: null // Campo para a imagem, como no seu código original
      });

      // O seu código de sucesso e limpeza de formulário continua igual
      setAlertMessage('Animal cadastrado com sucesso!');
      setNome('');
      setEspecie('');
      setRaca('');
      setSexo('');
      setNascimento(null);
      setTimeout(() => {
        setAlertMessage('');
        router.replace('/screens/listpetScreen');
      }, 1500);
      // =========================================================================

    } catch (error) {
      console.error('Error saving animal to Firestore:', error);
      setAlertMessage('Ocorreu um erro ao salvar o animal: ' + error.message);
    }
  };

  // Seu return com a interface (JSX) continua igual, sem mudanças.
  return (
    <View style={styles.container}>
      {/* ...seu JSX aqui... */}
    </View>
  );
}

// Seus estilos do componente principal continuam iguais, sem mudanças.
const styles = StyleSheet.create({ /* ...seus estilos aqui... */ });