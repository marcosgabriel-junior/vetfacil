import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Notificacoes() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <Text>Você ainda não tem notificações.</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
