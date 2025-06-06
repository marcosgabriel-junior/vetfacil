import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import ButtomMenu from './components/ButtomMenuComponents';
import TopDropDownMenu from './components/TopDropDownMenuComponents';

// =================== CÓDIGO DA PORRA DO FIREBASE ===================

// 1. Importar a configuração e as funções do Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../services/firebaseConfig'; // Ajuste o caminho se necessário

// 2. Inicializar o Firebase e exportar a conexão com o banco de dados
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// =========================================================


export default function Layout() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <TopDropDownMenu />
        <Slot />
        <ButtomMenu />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});