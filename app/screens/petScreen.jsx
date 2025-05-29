import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function Pet() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Criar modo de editar o cadastro */}

      <Image source={require("../../assets/images/dog1.jpeg")} style={styles.fotoPet}/>

      {/* Nome, raça e idade (pegar do cadastro futuramente)*/}
      <Text style={styles.nomePet}>Mel</Text>
      <Text style={styles.descricaoPet}>Vira-Lata{"\n"}Fêmea, 7 anos</Text>

      <Text style={styles.upcoming}>Chegando</Text>

      {/* Eventos que esse pet tem */}
      <View style={styles.card}>
        <Image source={require("../../assets/images/seringa.png")} style={styles.icone} />
        <View>
          <Text style={styles.tituloCard}>Vacina</Text>
          <Text style={styles.subtituloCard}>Proxima semana</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Image source={require("../../assets/images/tesouras.png")} style={styles.icone} />
        <View>
          <Text style={styles.tituloCard}>Tosa</Text>
          <Text style={styles.subtituloCard}>Em 2 semanas</Text>
        </View>
      </View>

      {/* Botão de adicionar evento */}
      <TouchableOpacity style={styles.botao}>
        <Text style={styles.botaoTexto}>+ Novo evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  fotoPet: {
    width: 190,
    height: 190,
    borderRadius: 90,
    marginVertical: 16,
  },
  nomePet: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  descricaoPet: {
    fontSize: 14,
    color: "green",
    textAlign: "center",
    marginBottom: 24,
  },
  upcoming: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  icone: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtituloCard: {
    fontSize: 14,
    color: "#6B7280",
  },
  botao: {
    marginTop: "50%",
    marginLeft: "40%",
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,

  },
  botaoTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
