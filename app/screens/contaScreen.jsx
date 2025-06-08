import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// https://www.youtube.com/watch?v=ZHwVBirqD2s
import { auth, db } from '../services/_firebaseconfig.js';
import { deleteUserAccount } from '../services/_firebaseServices.js';

const ConfirmationModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Excluir Conta Permanentemente</Text>
          <Text style={modalStyles.message}>
            Você tem certeza? Esta ação não pode ser desfeita. Todos os seus dados, incluindo pets e agendamentos, serão apagados para sempre.
          </Text>
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity onPress={onCancel} style={[modalStyles.button, modalStyles.cancelButton]}>
              <Text style={modalStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[modalStyles.button, modalStyles.confirmButton]}>
              <Text style={[modalStyles.buttonText, { color: 'white' }]}>Sim, Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default function Conta() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    const result = await deleteUserAccount();
    if (result.success) {
      Alert.alert("Conta Excluída", "Sua conta e todos os seus dados foram removidos com sucesso.");
      router.replace('/screens/loginScreen');
    } else {
      Alert.alert("Erro", result.error);
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.info}>Não foi possível carregar os dados. Por favor, faça o login.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ConfirmationModal
        visible={isDeleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />

      <View style={styles.mainContent}>
        <Image 
          source={require("../../assets/images/pessoa1.jpeg")} 
          style={styles.foto} 
        />
        <Text style={styles.nome}>{userData.name || 'Nome não informado'}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        {userData.phone && <Text style={styles.info}>Telefone: {userData.phone}</Text>}

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => setIsDeleteModalVisible(true)}
        >
          <Text style={styles.deleteButtonText}>Excluir Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainContent: {
    alignItems: 'center',
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
  },
  info: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 50,
    padding: 10,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 15,
    textDecorationLine: 'underline',
  }
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});