import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { useNavigation } from "@react-navigation/native"; // Para navegar de volta para a tela de login

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [dadosMensais, setDadosMensais] = useState({
    meses: [],
    receitaPorMes: [],
    despesaPorMes: [],
  });
  const [resumo, setResumo] = useState({
    receita: 0,
    despesa: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);
  const navigation = useNavigation(); // Usando o hook de navegação

  // Função para carregar os dados financeiros
  const carregarDados = async () => {
    if (!usuarioId) {
      return; // Se não tiver usuário logado, não faz a requisição
    }

    try {
      setLoading(true);
      const res = await api.get(`/lancamentos?usuario=${usuarioId}`);
      const lancamentos = res.data;

      let receita = 0;
      let despesa = 0;
      const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      const receitaPorMes = Array(12).fill(0);
      const despesaPorMes = Array(12).fill(0);

      lancamentos.forEach((l) => {
        const mesIndex = l.mes - 1;
        if (l.tipo === "RECEITA") {
          receitaPorMes[mesIndex] += l.valor;
          receita += l.valor;
        } else {
          despesaPorMes[mesIndex] += l.valor;
          despesa += l.valor;
        }
      });

      setResumo({
        receita,
        despesa,
        saldo: receita - despesa,
      });
      setDadosMensais({ meses, receitaPorMes, despesaPorMes });
    } catch (err) {
      console.log("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar o ID do usuário
  useEffect(() => {
    const carregarUsuario = async () => {
      const usuarioId = await AsyncStorage.getItem("usuarioId");
      setUsuarioId(usuarioId);
    };

    carregarUsuario();
  }, []);

  // Carregar os dados após verificar o usuário
  useEffect(() => {
    if (usuarioId) {
      carregarDados();
    }
  }, [usuarioId]);

  // Função para sair e limpar o cache (AsyncStorage)
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuarioId"); // Remove o ID do usuário do AsyncStorage
      navigation.navigate("LoginScreen"); // Redireciona para a tela de login (com o nome correto da tela)
    } catch (err) {
      console.log("Erro ao fazer logout:", err);
    }
  };

  // Exibir indicador de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Resumo Financeiro */}
      <View style={styles.resumoContainer}>
        <View style={[styles.card, styles.receitaCard]}>
          <Text style={styles.cardTitle}>Receitas</Text>
          <Text style={styles.cardValue}>
            R$ {resumo.receita.toLocaleString("pt-BR")}
          </Text>
        </View>

        <View style={[styles.card, styles.despesaCard]}>
          <Text style={styles.cardTitle}>Despesas</Text>
          <Text style={styles.cardValue}>
            R$ {resumo.despesa.toLocaleString("pt-BR")}
          </Text>
        </View>

        <View style={[styles.card, styles.saldoCard]}>
          <Text style={styles.cardTitle}>Saldo</Text>
          <Text style={styles.cardValue}>
            R$ {resumo.saldo.toLocaleString("pt-BR")}
          </Text>
        </View>
      </View>

      {/* Gráfico de Evolução Mensal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evolução Mensal</Text>
        <LineChart
          data={{
            labels: dadosMensais.meses,
            datasets: [
              {
                data: dadosMensais.receitaPorMes,
                color: () => "#2e7d32", // Cor para receitas
                strokeWidth: 2,
              },
              {
                data: dadosMensais.despesaPorMes,
                color: () => "#c62828", // Cor para despesas
                strokeWidth: 2,
              },
            ],
            legend: ["Receita", "Despesa"],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Botão de Atualizar Dados */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.refreshButton]}
          onPress={carregarDados}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Carregando..." : "Atualizar Dados"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão de Sair */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resumoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  receitaCard: {
    backgroundColor: "#e8f5e9",
  },
  despesaCard: {
    backgroundColor: "#ffebee",
  },
  saldoCard: {
    backgroundColor: "#e3f2fd",
  },
  cardTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  chart: {
    borderRadius: 16,
    marginTop: 8,
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: "#1976d2",
  },
  logoutButton: {
    backgroundColor: "#d32f2f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
