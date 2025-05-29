import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Pressable style={styles.botao} onPress={() => router.push('/login')}>
          <Text style={styles.texto}>Ir para Login</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/agendamentos')}>
          <Text style={styles.texto}>Ir para Agendamentos</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/config')}>
          <Text style={styles.texto}>Ir para Configuração</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/pet')}>
          <Text style={styles.texto}>Ir para Pet</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021123',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  botao: {
    width: "60%",
    alignItems: "center",
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  texto: {
    color: '#fff',
    fontSize: 18
  }
});