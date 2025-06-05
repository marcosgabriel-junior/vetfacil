import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // Adicionado Alert

export default function CadastroAnimal() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  
  // O estado 'nascimento' agora será uma string no formato 'DD/MM/AAAA' para o TextInput
  const [nascimentoInput, setNascimentoInput] = useState('');

  const handleSalvar = () => {
    // Validar se todos os campos estão preenchidos
    if (!nome || !especie || !raca || !nascimentoInput) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Tentar converter a string de data para um objeto Date
    const partesData = nascimentoInput.split('/');
    if (partesData.length !== 3) {
      Alert.alert('Erro', 'Formato de data inválido. Use DD/MM/AAAA.');
      return;
    }
    const dia = parseInt(partesData[0], 10);
    const mes = parseInt(partesData[1], 10) - 1; // Mês é baseado em 0 (janeiro é 0)
    const ano = parseInt(partesData[2], 10);

    const dataNascimentoObj = new Date(ano, mes, dia);

    // Validação básica da data (se é uma data válida e não futura)
    if (isNaN(dataNascimentoObj.getTime()) || dataNascimentoObj > new Date()) {
        Alert.alert('Erro', 'Data de nascimento inválida ou futura.');
        return;
    }

    console.log({
      nome,
      especie,
      raca,
      nascimento: dataNascimentoObj, // Enviando o objeto Date
    });
    Alert.alert('Sucesso', 'Animal cadastrado!');

    // Opcional: Limpar os campos após o cadastro
    setNome('');
    setEspecie('');
    setRaca('');
    setNascimentoInput('');
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

      <Text style={styles.label}>Data de nascimento (DD/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 12/04/2020"
        value={nascimentoInput}
        onChangeText={setNascimentoInput}
        keyboardType="numeric" // Sugere teclado numérico para facilitar a digitação da data
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