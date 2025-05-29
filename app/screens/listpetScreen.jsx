import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Pet() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Meus Pets</Text>
        <Text style={styles.addIcon}>＋</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={{ width: "95%" }}>
        {/* Lista de Pets */}
        <TouchableOpacity onPress={() => router.push('/screens/petScreen')}>
          <View style={styles.card}>    
            <Image source={require("../../assets/images/dog1.jpeg")} style={styles.fotoPet}/>
            <View style={styles.infoPet}>
              <Text style={styles.nomePet}>Mel</Text>
              <Text style={styles.tipoPet}>Cachorro</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.card}>
          <Image source={require("../../assets/images/dog2.jpeg")} style={styles.fotoPet} />
          <View style={styles.infoPet}>
            <Text style={styles.nomePet}>Teddy</Text>
            <Text style={styles.tipoPet}>Cachorro</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image source={require("../../assets/images/cat1.jpeg")} style={styles.fotoPet} />
          <View style={styles.infoPet}>
            <Text style={styles.nomePet}>Luna</Text>
            <Text style={styles.tipoPet}>Gato</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image source={require("../../assets/images/rat1.jpeg")} style={styles.fotoPet} />
          <View style={styles.infoPet}>
            <Text style={styles.nomePet}>Teo</Text>
            <Text style={styles.tipoPet}>Hamster</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={() => router.push('/screens/cadastroAnimalScreen')}>
        <Text style={styles.botaoTexto}>＋ Adicionar Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addIcon: {
    fontSize: 24,
    color: "#333",
  },
  card: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  fotoPet: {
    width: 55,
    height: 55,
    borderRadius: 55,
    marginRight: 12,
  },
  infoPet: {
    justifyContent: "center",
  },
  nomePet: {
    fontSize: 16,
    fontWeight: "600",
  },
  tipoPet: {
    fontSize: 14,
    color: "#6B7280",
  },
  botao: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#22C55E",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
