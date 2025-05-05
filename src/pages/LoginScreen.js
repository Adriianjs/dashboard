import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const id = await AsyncStorage.getItem("usuarioId");
      if (id) {
        navigation.reset({
          index: 0,
          routes: [{ name: "DashboardScreen" }],
        });
      }
    };

    checkIfLoggedIn(); // Verifica se o usuário já está logado
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(""); // Resetando a mensagem de erro
      const response = await api.post("/usuarios/autenticar", { email, senha });

      if (response.data && response.data.id) {
        // Salvar o ID do usuário no AsyncStorage
        await AsyncStorage.setItem("usuarioId", response.data.id.toString());

        // Navegar para a tela DashboardScreen
        navigation.reset({
          index: 0,
          routes: [{ name: "DashboardScreen" }],
        });
      } else {
        throw new Error("Usuário ou senha inválidos");
      }
    } catch (error) {
      setErrorMessage("Erro ao logar. Verifique suas credenciais.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Button
        title={loading ? "Carregando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
