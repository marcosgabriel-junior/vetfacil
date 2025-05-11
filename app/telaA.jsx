import { Text, View, StyleSheet, Image, Pressable, TextInput } from "react-native";
import { useRouter, Link } from "expo-router";

export default function Login() {
  const router = useRouter();
  return (
    <View  style={styles.container}>
      <View style={styles.imagemCont}>
        <Image style={styles.imagem} source={require('../app/Logo02.png')} />
      </View>
      <View style={styles.form}>
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput placeholder='digite seu e-mail...' style={styles.input}></TextInput>
        <Text style={styles.label}>Senha</Text>
         <TextInput placeholder='digite sua senha...' style={styles.input} secureTextEntry></TextInput>
      </View>
        <Pressable style={styles.button} onPress={() => router.push('/TelaB')}>
          <Text style={styles.buttonText}>Acessar</Text>
        </Pressable>
        <Link href='/signup/page' style={styles.link}>
          <Text>Ainda não tem uma conta? Cadastre-se.</Text>
        </Link>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(226, 240, 217)',
  },
  titulo: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: 15,
    color: 'white',
  },
  imagemCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  imagem: {
    height: 350,
    width: 350
  },
 form: {
  flex: 1,
  backgroundColor: 'rgb(255, 255, 255)',
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  paddingTop: 24,
  paddingLeft: 14,
  paddingRight: 14,
  marginTop: 100,
 },
label: {
  color: 'rgb(255, 255, 255)',
  marginBottom: 4,
},
input:{
  borderLeftColor: 'rgb(255, 255, 255)',
  borderRightColor: 'rgb(255, 255, 255)',
  borderTopColor: 'rgb(255, 255, 255)',
  borderWidth: 1,
  borderColor: 'rgb(3, 3, 3)',
  borderRadius: 8,
  marginBottom: 16,
  paddingHorizontal: 8,
  paddingTop: 14,
  paddingBottom: 14
},
button:{
  backgroundColor: 'rgb(169, 209, 142)',
  paddingTop: 14,
  paddingBottom: 14,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  borderRadius: 8
},
buttonText:{
  color: 'rgb(255, 255, 255)',
  fontWeight: 'bold'
},
link:{
  color: 'rgb(204, 228, 189)',
  marginTop: 16,
  textAlign: 'center'
}
})