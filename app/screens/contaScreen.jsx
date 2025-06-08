import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../services/_firebaseconfig.js';

export default function Conta() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log(`Documento para o UID ${user.uid} NÃO existe na coleção 'users'.`);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Verificando autenticação...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.info}>Não foi possível carregar os dados.</Text>
        <Text style={styles.info}>Por favor, faça o login.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={require("../../assets/images/pessoa1.jpeg")} 
        style={styles.foto} 
      />
      {/* CORREÇÃO: Exibe o nome se ele existir, ou um texto padrão caso contrário. */}
      <Text style={styles.nome}>{userData.nome || 'Nome não informado'}</Text>
      
      {/* O e-mail já funciona, pois ele sempre existe. */}
      <Text style={styles.email}>{userData.email}</Text>
      
      {/* CORREÇÃO: Mostra o telefone apenas se o campo 'phone' existir no documento. */}
      {userData.phone && <Text style={styles.info}>Telefone: {userData.phone}</Text>}
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
  centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  foto: {
      width: 160,
      height: 160,
      borderRadius: 80,
      marginBottom: 20,
      borderWidth: 3,
      borderColor: '#ccc',
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
      textAlign: 'center',
  }
});