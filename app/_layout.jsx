import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import ButtomMenu from './components/ButtomMenuComponents';
import TopDropDownMenu from './components/TopDropDownMenuComponents';

// =================== CÓDIGO DO FIREBASE AJUSTADO ===================

// Importe a instância 'db' diretamente do seu firebaseConfig.js
// ASSUMindo que firebaseConfig.js está em './services/firebaseConfig'

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