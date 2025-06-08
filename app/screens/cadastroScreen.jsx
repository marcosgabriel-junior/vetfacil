import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cadastrarUsuario } from '../services/_firebaseServices.js';

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


export default function Cadastro() { 
  const router = useRouter(); 
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);


  const handleCadastro = async () => {
    const nomeFormatado = nome.trim();
    const emailFormatado = email.trim();

    if (!nomeFormatado || !emailFormatado || !senha) {
      setAlertMessage('Por favor, preencha todos os campos!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailFormatado)) {
      setAlertMessage('E-mail Inválido. Por favor, insira um formato de e-mail válido.');
      return;
    }

    setIsLoading(true);
    const resultado = await cadastrarUsuario(nomeFormatado, emailFormatado, senha);
    setIsLoading(false);

    if (resultado.success) {
      setIsSuccess(true);
      setAlertMessage(`Bem-vindo, ${nomeFormatado}! Seu cadastro foi realizado.`);
    } else {
      setIsSuccess(false);
      setAlertMessage(resultado.error);
    }
  };
  
  const handleCloseAlert = () => {
    const success = isSuccess;
    setAlertMessage('');
    setIsSuccess(false);
    if (success) {
      setNome('');
      setEmail('');
      setSenha('');
      // CORREÇÃO: O caminho agora corresponde à localização do arquivo (app/screens/loginScreen.jsx)
      router.replace('/screens/loginScreen'); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!isLoading}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Cadastrar" onPress={handleCadastro} />
      )}
      
      <CustomAlert message={alertMessage} onClose={handleCloseAlert} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

const alertStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});