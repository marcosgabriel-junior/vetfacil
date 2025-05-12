import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Pressable style={styles.botao} onPress={() => router.push('/login')}>
          <Text style={styles.texto}>Ir para Tela de login</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/telaB')}>
          <Text style={styles.texto}>Ir para Tela B</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/config')}>
          <Text style={styles.texto}>Ir para Tela de configuração</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/telaD')}>
          <Text style={styles.texto}>Ir para Tela D</Text>
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