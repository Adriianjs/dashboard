import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Clipboard,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const GerarPaleta = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [baseColor, setBaseColor] = useState(
    route.params?.baseColor || "#FFFFFF"
  );
  const [palette, setPalette] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchPalette();
  }, [baseColor]);

  const fetchPalette = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${baseColor.replace(
          "#",
          ""
        )}&mode=analogic&count=5`
      );
      const data = await response.json();
      setPalette(data.colors.map((c) => c.hex.value));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar a paleta");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (color) => {
    Clipboard.setString(color);
    Alert.alert(
      "Copiado!",
      `Cor ${color} copiada para a área de transferência`
    );
  };

  const handleEditColor = () => {
    setEditing(true);
  };

  const handleSaveColor = () => {
    if (/^#[0-9A-F]{6}$/i.test(baseColor)) {
      fetchPalette();
      setEditing(false);
    } else {
      Alert.alert(
        "Formato inválido",
        "Digite um código hexadecimal válido (ex: #FF0000)"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.baseColorContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>COR BASE</Text>
          {editing ? (
            <TouchableOpacity onPress={handleSaveColor}>
              <Text style={styles.editButton}>SALVAR</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEditColor}>
              <Text style={styles.editButton}>EDITAR</Text>
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <TextInput
            style={[styles.colorBox, styles.colorInput]}
            value={baseColor}
            onChangeText={setBaseColor}
            maxLength={7}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        ) : (
          <TouchableOpacity
            style={[styles.colorBox, { backgroundColor: baseColor }]}
            onPress={() => copyToClipboard(baseColor)}
            onLongPress={handleEditColor}
          >
            <Text style={styles.colorText}>{baseColor}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.paletteContainer}>
        <Text style={styles.sectionTitle}>PALETA GERADA</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {palette.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={styles.paletteColorContainer}
                onPress={() => copyToClipboard(color)}
              >
                <View
                  style={[styles.paletteColorBox, { backgroundColor: color }]}
                />
                <Text style={styles.paletteColorText}>{color}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.actionButtonText}>Mudar cor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#210518",
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  baseColorContainer: {
    marginBottom: 30,
  },
  paletteContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#210518",
    textTransform: "uppercase",
  },
  editButton: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#210518",
  },
  colorBox: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  colorInput: {
    backgroundColor: "#FFF",
    color: "#000",
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  colorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  paletteColorContainer: {
    marginRight: 15,
    alignItems: "center",
  },
  paletteColorBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  paletteColorText: {
    fontSize: 12,
    fontWeight: "500",
  },
  loader: {
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: "#210518",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "bold",
  },
});

export default GerarPaleta;
