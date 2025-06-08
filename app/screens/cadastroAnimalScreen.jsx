import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// CORREÇÃO: A importação agora usa o nome de arquivo correto com "_" no início
// e a extensão .js para garantir que o módulo seja resolvido.
import { db } from '../services/_firebaseconfig.js';

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

export default function CadastroAnimal() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userLoggedInId');
      if (id) {
        setUserId(id);
      } else {
        setAlertMessage('Usuário não logado.');
        router.replace('/screens/loginScreen');
      }
    };
    getUserId();
  }, []);

  const parseDate = (dataStr) => {
    const partes = dataStr.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, ano] = partes;
    // Formato AAAA-MM-DD para o construtor da data ser mais confiável
    const data = new Date(`${ano}-${mes}-${dia}`);
    return isNaN(data.getTime()) ? null : data;
  };

  const handleSalvar = async () => {
    if (!userId || !nome || !especie || !raca || !nascimento || !sexo) {
      setAlertMessage('Por favor, preencha todos os campos.');
      return;
    }

    const dataNascimento = parseDate(nascimento);
    if (!dataNascimento) {
      setAlertMessage('Data de nascimento inválida. Use o formato dd/mm/aaaa.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'pets'), {
        donoid: userId,
        name: nome,
        species: especie,
        breed: raca,
        gender: sexo,
        birthdate: Timestamp.fromDate(dataNascimento),
        registeredAt: Timestamp.now(),
        image_uri: null
      });

      console.log("✅ Pet cadastrado com sucesso! ID:", docRef.id);

      setAlertMessage('Animal cadastrado com sucesso!');
      setNome('');
      setEspecie('');
      setRaca('');
      setSexo('');
      setNascimento('');

      setTimeout(() => {
        setAlertMessage('');
        router.replace('/screens/listpetScreen');
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar o pet:", error);
      setAlertMessage("Erro ao salvar o pet. Verifique suas permissões no Firestore.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Animal</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Espécie" value={especie} onChangeText={setEspecie} />
      <TextInput style={styles.input} placeholder="Raça" value={raca} onChangeText={setRaca} />
      <TextInput style={styles.input} placeholder="Sexo" value={sexo} onChangeText={setSexo} />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (dd/mm/aaaa)"
        value={nascimento}
        onChangeText={setNascimento}
        keyboardType="numeric"
      />
      <Button title="Salvar" onPress={handleSalvar} />
      <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10
  }
});

const alertStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    elevation: 5,
    width: '80%'
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
