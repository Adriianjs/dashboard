import React, { useState, useRef } from "react";
import {
  Alert,
  Modal,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
  View,
  Text,
  Clipboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Container,
  HexText,
  ModalContainer,
  ModalContent,
  ColorInput,
  ButtonText,
} from "../styles";

const GerarCor = () => {
  const [currentColor, setCurrentColor] = useState("#FFFFFF");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedHex, setEditedHex] = useState("");
  const [textColor, setTextColor] = useState("black");
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  const generateColor = async () => {
    try {
      const response = await fetch("https://www.thecolorapi.com/random");
      const data = await response.json();
      const newColor = data.hex.value;
      updateColor(newColor);
    } catch (error) {
      Alert.alert("Erro", "Falha ao gerar cor");
      generateFallbackColor();
    }
  };

  const generateFallbackColor = () => {
    const hex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    updateColor(hex);
  };

  const updateColor = (hex) => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return;

    const hexColor = hex.replace("#", "");
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    setTextColor(luminance > 0.5 ? "black" : "white");
    setCurrentColor(hex);
  };

  const copyToClipboard = () => {
    Clipboard.setString(currentColor);
    Alert.alert("Copiado!", `Cor ${currentColor} copiada`);
  };

  const handleEdit = () => {
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(editedHex)) {
      updateColor(editedHex);
      setEditModalVisible(false);
    } else {
      Alert.alert("Formato inválido", "Use o formato #FFFFFF");
    }
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Container>
      <TouchableWithoutFeedback
        onPress={copyToClipboard}
        onLongPress={() => {
          setEditedHex(currentColor);
          setEditModalVisible(true);
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: 300,
            height: 300,
            borderRadius: 20,
            backgroundColor: currentColor,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
          }}
        >
          <HexText light={textColor === "white"}>{currentColor}</HexText>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          animatePress();
          generateColor();
        }}
      >
        <Text
          style={{
            fontSize: 40,
            color: "black",
            marginTop: 40,
            padding: 10,
          }}
        >
          ↻
        </Text>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("GerarPaleta", { baseColor: currentColor })
        }
      >
        <Text
          style={{
            fontSize: 40,
            color: "black",
            textDecorationLine: "underline",
            marginTop: 20,
            padding: 10,
          }}
        >
          Gerar Paleta
        </Text>
      </TouchableWithoutFeedback>

      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <ModalContainer>
            <ModalContent>
              <ColorInput
                placeholder="Digite o novo HEX"
                placeholderTextColor="#999"
                autoCapitalize="characters"
                value={editedHex}
                onChangeText={setEditedHex}
                maxLength={7}
              />

              <TouchableWithoutFeedback onPress={handleEdit}>
                <View
                  style={{
                    padding: 15,
                    backgroundColor: "#210518",
                    borderRadius: 5,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <ButtonText>CONFIRMAR</ButtonText>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => setEditModalVisible(false)}
              >
                <View
                  style={{
                    padding: 15,
                    backgroundColor: "#e74c3c",
                    borderRadius: 5,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <ButtonText>CANCELAR</ButtonText>
                </View>
              </TouchableWithoutFeedback>
            </ModalContent>
          </ModalContainer>
        </TouchableWithoutFeedback>
      </Modal>
    </Container>
  );
};

export default GerarCor;
