//npx expo install @react-native-async-storage/async-storage
//npm install react-native-modal-datetime-picker @react-native-community/datetimepicker
//npx expo install react-native-modal-datetime-picker @react-native-community/datetimepicker
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function CadastroAnimal() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');

  // Estado começa como `null`, ou seja, sem data selecionada
  const [nascimento, setNascimento] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setNascimento(date);
    hideDatePicker();
  };

  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR');
  };

  const handleSalvar = () => {
    if (!nome || !especie || !raca || !nascimento) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    console.log({ nome, especie, raca, nascimento });
    alert('Animal cadastrado!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Animal</Text>

      <Text style={styles.label}>Nome do animal</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Totó"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Espécie</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Cachorro"
        value={especie}
        onChangeText={setEspecie}
      />

      <Text style={styles.label}>Raça</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Poodle"
        value={raca}
        onChangeText={setRaca}
      />

      <Text style={styles.label}>Data de nascimento</Text>
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        <Text style={{ color: nascimento ? '#000' : '#999' }}>
          {nascimento ? formatarData(nascimento) : 'Ex: 12/04/2020'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
        locale="pt-BR"
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 12,
    color: '#555',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});
