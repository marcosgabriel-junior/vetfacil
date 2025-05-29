import { Image, StyleSheet, Text, View } from "react-native";

export default function Agendamentos() {
  return (
    <View style={styles.container}>
      
      {/* Cabeçalho */}
      <Text style={styles.titulo}>Agendamentos</Text>

      {/* Seção Próximos */}
      <Text style={styles.subtitulo}>Próximos</Text>

      <View style={styles.card}>
        <View style={styles.iconeBox}>
          <Image source={require("../../assets/images/seringa.png")} style={styles.icone} />
        </View>
        <View style={styles.info}>
          <Text style={styles.tituloCard}>Raiva</Text>
          <Text style={styles.subtituloCard}>Vacina</Text>
        </View>
        <Text style={styles.data}>20/07/2025</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconeBox}>
          <Image source={require("../../assets/images/tesouras.png")} style={styles.icone} />
        </View>
        <View style={styles.info}>
          <Text style={styles.tituloCard}>Consulta de rotina</Text>
          <Text style={styles.subtituloCard}>Evento</Text>
        </View>
        <Text style={styles.data}>25/07/2025</Text>
      </View>

      {/* Seção Passados */}
      <Text style={styles.subtitulo}>Passados</Text>

      <View style={styles.card}>
        <View style={styles.iconeBox}>
          <Image source={require("../../assets/images/seringa.png")} style={styles.icone} />
        </View>
        <View style={styles.info}>
          <Text style={styles.tituloCard}>V8</Text>
          <Text style={styles.subtituloCard}>Vacina</Text>
        </View>
        <Text style={styles.data}>15/05/2025</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconeBox}>
          <Image source={require("../../assets/images/tesouras.png")} style={styles.icone} />
        </View>
        <View style={styles.info}>
          <Text style={styles.tituloCard}>Banho e tosa</Text>
          <Text style={styles.subtituloCard}>Evento</Text>
        </View>
        <Text style={styles.data}>10/05/2024</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  iconeBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icone: {
    width: 24,
    height: 24,
  },
  info: {
    flex: 1,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtituloCard: {
    fontSize: 14,
    color: "#6B7280",
  },
  data: {
    fontSize: 14,
    color: "#6B7280",
  },
});
