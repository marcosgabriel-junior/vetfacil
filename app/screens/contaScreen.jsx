import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseconfig';
import { getAuth } from 'firebase/auth';

export default function Conta() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('Nenhum dado encontrado!');
        }
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    console.log("Aguardando dados do usuário...");
    return <Text style={{ padding: 20 }}>Carregando dados do usuário...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/pessoa1.jpeg")} style={styles.foto} />
      <Text style={styles.nome}>{userData.name}</Text>
      <Text style={styles.email}>{userData.email}</Text>
      <Text style={styles.info}>Telefone: {userData.phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  foto: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  email: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    color: '#4B5563',
  },
});
