import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { signInWithEmailAndPassword } from 'firebase/auth';
// CORREÇÃO: Importamos 'auth' diretamente do nosso arquivo de configuração,
// o que é mais consistente com o resto do projeto.
import { auth } from '../services/_firebaseconfig.js';

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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage("Por favor, insira email e senha.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva o ID do usuário localmente para ser usado em outras telas
      await AsyncStorage.setItem('userLoggedInId', user.uid);
      
      // Feedback para o usuário e redirecionamento
      setAlertMessage("Login realizado com sucesso!");
      setTimeout(() => {
        setAlertMessage('');
        router.replace('/screens/listpetScreen');
      }, 1500);

    } catch (error) {
      console.error("Erro ao fazer login:", error.code);
      // Melhora a mensagem de erro para o usuário
      let friendlyMessage = 'Ocorreu um erro ao tentar fazer login.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        friendlyMessage = 'E-mail ou senha incorretos.';
      }
      setAlertMessage(friendlyMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />
        
        <View style={styles.imagemCont}>
          <Image style={styles.imagem} source={require('../../assets/images/Logo02.png')} />
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder='digite seu e-mail...'
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder='digite sua senha...'
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Acessar</Text>
          </Pressable>
          <Link href="/screens/cadastroScreen" asChild>
           <TouchableOpacity>
             <Text style={styles.link}>Ainda não tem uma conta? Cadastre-se.</Text>
           </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(226, 240, 217)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  imagemCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagem: {
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },
  form: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 20,
  },
  label: {
    color: '#333',
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'rgb(169, 209, 142)',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: '#007AFF',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 15,
  }
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