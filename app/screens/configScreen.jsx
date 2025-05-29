/*Primeiro, se você não tiver o React Navigation configurado no seu projeto, você pode instalar as dependências necessárias:
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
E também não se esqueça de rodar o comando para instalar as dependências de navegação:
npx pod-install
*/
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

      <TouchableOpacity style={styles.option} onPress={() => router.push('/screens/notificacoesScreen')}>
      <Text style={styles.optionText}>🔔 Notificações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => router.push('/screens/cadastroAnimalScreen')}>
        <Text style={styles.optionText}>📋 Cadastrar Animal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => router.push('/screens/listpetScreen')}>
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
