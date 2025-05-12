import { View, Text, StyleSheet } from "react-native";

export default function TelaD() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Esta é a Tela D</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#F0F8FF"
  },
  texto: {
    fontSize: 24
  }
});