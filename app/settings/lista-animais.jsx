import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListaAnimais() {
  const [animais, setAnimais] = useState([]);

  useEffect(() => {
    const carregarAnimais = async () => {
      const stored = await AsyncStorage.getItem('animais');
      if (stored) {
        setAnimais(JSON.parse(stored));
      }
    };
    carregarAnimais();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animais Cadastrados</Text>
      {animais.length === 0 ? (
        <Text style={styles.empty}>Nenhum animal cadastrado.</Text>
      ) : (
        <FlatList
          data={animais}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.info}>{item.especie} - {item.raca}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
});
