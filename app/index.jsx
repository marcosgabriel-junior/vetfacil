import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { initDB } from './services/database'; //importando o banco de dados favor não mexer feito pelo marcos.

export default function Index() {
  const router = useRouter();

  // Adicione este useEffect para inicializar o banco de dados
  useEffect(() => {
    initDB(); // Chama a função que verifica/cria suas tabelas
  }, []); // O array vazio [] garante que esta função execute apenas uma vez, na montagem do componente

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Pressable style={styles.botao} onPress={() => router.push('/screens/loginScreen')}>
          <Text style={styles.texto}>Ir para Login</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/screens/agendamentosScreen')}>
          <Text style={styles.texto}>Ir para Agendamentos</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/screens/configScreen')}>
          <Text style={styles.texto}>Ir para Configuração</Text>
        </Pressable>
        {/* Este botão para PetScreen agora deve funcionar corretamente após login */}
        <Pressable style={styles.botao} onPress={() => router.push('/screens/listpetScreen')}>
          <Text style={styles.texto}>Ir para Meus Pets</Text>
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
