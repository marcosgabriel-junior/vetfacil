// loginScreen.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../_layout';

// O componente de Alerta Customizado não precisa de mudanças
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

// Seus estilos do Alerta não precisam de mudanças
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
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const user = userCredential.user;

      if (user) {
        await AsyncStorage.setItem('userLoggedInId', user.uid);
        
        setAlertMessage("Login realizado com sucesso!");
        setTimeout(() => {
          setAlertMessage('');
          router.replace('/screens/listpetScreen');
        }, 1500);
      }

    } catch (error) {
      console.error("Erro ao fazer login:", error.code, error.message);
      // ======================= MUDANÇA PARA DEBUG =======================
      // A linha abaixo vai mostrar o código de erro exato na tela
      setAlertMessage(`Erro do Firebase: ${error.code}`);
      // ==================================================================
    }
  };

  // O seu return com a interface (JSX) continua o mesmo.
  return (
    <View style={styles.container}>
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
        <Link href='/screens/signupScreen' style={styles.link}>
          <Text>Ainda não tem uma conta? Cadastre-se.</Text>
        </Link>
      </View>
    </View>
  );
}

// Seus estilos para a tela não precisam de mudanças
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(226, 240, 217)',
  },
  titulo: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: 15,
    color: 'white',
  },
  imagemCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  imagem: {
    height: 350,
    width: 350
  },
  form: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
    marginTop: 100,
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