import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { buscarContatos } from './services/contatoService.js'; // ajuste o caminho se necessário

export default function TelaA() {
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarContatos();
  }, []);

  const carregarContatos = async () => {
    setCarregando(true);
    const dados = await buscarContatos();
    setContatos(dados);
    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      {carregando ? (
        <ActivityIndicator size="large" color="#00BFFF" />
      ) : (
        <FlatList
          data={contatos}
          keyExtractor={(item) => item.id}
          numColumns={1}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    index % 2 === 0 ? '#E0F7FA' : '#FCE4EC',
                },
              ]}
            >
              <Image
                source={{
                  uri: item.avatar
                    ? item.avatar
                    : 'https://i.pravatar.cc/150?u=default',
                }}
                style={styles.avatar}
              />
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.telefone}>{item.telefone}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.info}>
                Categoria: {item.categoria}
              </Text>
              <Text style={styles.info}>
                Sexo: {item.sexo}
              </Text>
              <Text style={styles.info}>
                Favorito: {item.favorito ? '⭐ Sim' : 'Não'}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 70,
  },
  lista: {
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  telefone: {
    fontSize: 14,
    color: '#666',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  info: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
});