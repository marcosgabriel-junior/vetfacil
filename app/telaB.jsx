import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // instale com: expo install @react-native-picker/picker
import { salvarContato } from "./services/contatoService.js"; // ajuste o caminho se necessário

export default function TelaB() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Checkbox (Switch)
  const [favorito, setFavorito] = useState(false);

  // Combo (Picker)
  const [categoria, setCategoria] = useState("amigo");

  // Radio buttons
  const [sexo, setSexo] = useState("masculino");

  const gravarContato = async () => {
    if (!nome || !telefone || !email) {
      setMensagem("⚠️ Preencha todos os campos.");
      return;
    }

    try {
      await salvarContato({ nome, telefone, email, favorito, categoria, sexo });
      setMensagem("✅ Contato salvo com sucesso!");

      // Limpa os campos
      setNome("");
      setTelefone("");
      setEmail("");
      setFavorito(false);
      setCategoria("amigo");
      setSexo("masculino");

      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      setMensagem("❌ Erro ao salvar o contato.");
      setTimeout(() => setMensagem(""), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Contato</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Switch (Checkbox) */}
      <View style={styles.switchContainer}>
        <Text>Favorito?</Text>
        <Switch value={favorito} onValueChange={setFavorito} />
      </View>

      {/* Combo (Picker) */}
      <Text style={styles.label}>Categoria:</Text>
      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Amigo" value="amigo" />
        <Picker.Item label="Família" value="familia" />
        <Picker.Item label="Trabalho" value="trabalho" />
      </Picker>

      {/* Radio buttons */}
      <Text style={styles.label}>Sexo:</Text>
      <View style={styles.radioContainer}>
        {["masculino", "feminino"].map((valor) => (
          <TouchableOpacity
            key={valor}
            style={styles.radioItem}
            onPress={() => setSexo(valor)}
          >
            <View style={styles.radioCircle}>
              {sexo === valor && <View style={styles.radioSelected} />}
            </View>
            <Text>{valor}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Salvar Contato" onPress={gravarContato} />

      {mensagem !== "" && <Text style={styles.toast}>{mensagem}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 15,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#666",
  },
  toast: {
    marginTop: 20,
    backgroundColor: "#dff0d8",
    color: "#3c763d",
    padding: 10,
    textAlign: "center",
    borderRadius: 5,
  },
});