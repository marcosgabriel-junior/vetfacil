import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <TouchableOpacity style={styles.option} onPress={() => router.push('/screens/contaScreen')}>
        <Text style={styles.optionText}>👤 Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => router.push('/screens/cadastroAnimalScreen')}>
        <Text style={styles.optionText}>📋 Cadastrar Animal</Text>
      </TouchableOpacity>

      {/* CORREÇÃO APLICADA AQUI: O caminho foi alterado de listpetScreen para lista-animais */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('/screens/lista-animais')}>
        <Text style={styles.optionText}>🐾 Lista de Animais</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, styles.logout]} onPress={() => router.replace('/screens/loginScreen')}>
        <Text style={[styles.optionText, styles.logoutText]}>🚪 Sair da Conta</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 18,
  },
  logout: {
    backgroundColor: '#FFDDDD',
  },
  logoutText: {
    color: '#B00000',
  },
});
