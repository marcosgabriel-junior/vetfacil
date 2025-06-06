// loginScreen.jsx
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para armazenar o ID do usuário logado
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getUserByEmailAndPassword } from '../services/database'; // Importa a função de login do seu DB

// Componente de Modal Customizada (reutilizado de outras telas)
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


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(''); // Estado para a mensagem da modal

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage("Por favor, insira email e senha.");
      return;
    }

    try {
      // Tenta buscar o usuário no banco de dados com as credenciais fornecidas
      const user = await getUserByEmailAndPassword(email, password);

      if (user) {
        // Login bem-sucedido: armazena o ID do usuário no AsyncStorage
        await AsyncStorage.setItem('userLoggedInId', user.id.toString());
        setAlertMessage("Login realizado com sucesso!");
        // Redireciona para a tela de lista de pets após um pequeno atraso
        setTimeout(() => {
          setAlertMessage(''); // Limpa a mensagem antes de navegar
          router.replace('/screens/listpetScreen'); // Usa replace para não permitir voltar para o login pelo botão voltar
        }, 1500);
      } else {
        // Credenciais incorretas
        setAlertMessage("Email ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setAlertMessage("Ocorreu um erro ao tentar fazer login: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Componente da modal customizada */}
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
            keyboardType="email-address" // Facilita a digitação de email
            autoCapitalize="none" // Evita auto-capitalização de email
          />
          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder='digite sua senha...'
            style={styles.input}
            secureTextEntry // Esconde a senha
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable style={styles.button} onPress={handleLogin}> {/* Chama handleLogin */}
          <Text style={styles.buttonText}>Acessar</Text>
        </Pressable>
        {/* Link para a tela de cadastro (ajustado para a nova estrutura) */}
        <Link href='/screens/signupScreen' style={styles.link}>
          <Text>Ainda não tem uma conta? Cadastre-se.</Text>
        </Link>
      </View>
    </View>
  );
}

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
    color: '#333', // Alterado para ser visível no fundo branco do formulário
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC', // Cor de borda mais suave
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12, // Um pouco mais de padding horizontal
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
    marginTop: 20, // Espaçamento do input
  },
  buttonText: {
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: '#007AFF', // Cor de link padrão para melhor contraste
    marginTop: 16,
    textAlign: 'center',
    fontSize: 15,
  }
});
