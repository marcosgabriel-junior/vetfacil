import { Image, StyleSheet, Text, View } from 'react-native';

export default function Conta() {
  return (
    <View style={styles.container}>
      
      {/* Imagem de perfil */}
      <Image source={require("../../assets/images/pessoa1.jpeg")} style={styles.foto}/>
      
      {/* Nome do usuário */}
      <Text style={styles.nome}>Fulano da Silva</Text>
      
      {/* Espaço reservado para outros dados */}
      <Text style={styles.email}>fulano@email.com</Text>
      <Text style={styles.info}>Telefone: (31) 91234-5678</Text>

      {/* Futuro: botão para editar perfil, logout etc. */}

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
