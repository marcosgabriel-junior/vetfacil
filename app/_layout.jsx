import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import ButtomMenu from './ButtomMenu';
import TopDropDownMenu from './TopDropDownMenu';

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