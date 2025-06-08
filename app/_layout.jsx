import { Slot, usePathname } from 'expo-router'; // 1. Importa o usePathname
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import ButtomMenu from './components/ButtomMenuComponents';
import TopDropDownMenu from './components/TopDropDownMenuComponents';

export default function Layout() {
  // 2. Obtém o caminho da rota atual (ex: "/screens/loginScreen")
  const pathname = usePathname();

  // 3. Define em quais telas o menu NÃO deve aparecer
  const screensWithoutMenu = [
    '/screens/loginScreen', 
    '/screens/cadastroScreen'
  ];

  // 4. Verifica se a tela atual está na lista de telas sem menu
  const hideMenu = screensWithoutMenu.includes(pathname);

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* O menu superior pode continuar aparecendo ou ser ocultado com a mesma lógica */}
        <TopDropDownMenu /> 
        
        <Slot />
        
        {/* 5. Renderiza o menu inferior apenas se a tela atual NÃO estiver na lista de exclusão */}
        { !hideMenu && <ButtomMenu /> }
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
