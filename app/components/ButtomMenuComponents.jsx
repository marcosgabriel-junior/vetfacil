import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function BottomMenu() {
  const router = useRouter();

  return (
    <View style={styles.menu}>

      <Pressable style={styles.button} onPress={() => router.push('../screens/listpetScreen')}>
        <Text style={styles.icon}>🐾</Text>
        <Text style={styles.label}>Pets</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('../screens/agendamentosScreen')}>
        <Text style={styles.icon}>📅</Text>
        <Text style={styles.label}>Agendamentos</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('../screens/configScreen')}>
        <Text style={styles.icon}>⚙</Text>
        <Text style={styles.label}>Configuração</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 12,
    color: '#374151',
    marginTop: 2,
  },
});