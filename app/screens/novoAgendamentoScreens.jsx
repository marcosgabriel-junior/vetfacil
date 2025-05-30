import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function CriarEvento() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [motivo, setMotivo] = useState("");
  const [data, setData] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const salvarEvento = () => {
    if (!nome || !tipo || !local) {
      Alert.alert("Preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você pode salvar os dados em banco, local storage, API, etc.
    Alert.alert("Evento salvo com sucesso!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do evento"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo (Vacina, Consulta, etc)"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Local"
        value={local}
        onChangeText={setLocal}
      />
      <TextInput
        style={styles.input}
        placeholder="Motivo / Observação"
        value={motivo}
        onChangeText={setMotivo}
      />

      <Button title="Escolher Data" onPress={() => setMostrarPicker(true)} />
      <Text style={styles.dataSelecionada}>
        Data: {data.toLocaleDateString()} {data.toLocaleTimeString()}
      </Text>

      {mostrarPicker && (
        <DateTimePicker
          value={data}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            const atual = selectedDate || data;
            setMostrarPicker(false);
            setData(atual);
          }}
        />
      )}

      <Button title="Salvar Evento" onPress={salvarEvento} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  dataSelecionada: {
    marginVertical: 8,
    fontSize: 16,
  },
});
