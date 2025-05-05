import styled from "styled-components/native";
import { TouchableOpacity, TextInput, View, Modal } from "react-native";

export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

export const GenerateButton = styled(TouchableOpacity)`
  background-color: #210518;
  padding: 15px 30px;
  border-radius: 25px;
  align-items: center;
  margin-vertical: 10px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

export const ColorDisplay = styled(View)`
  width: 300px;
  height: 300px;
  border-radius: 20px;
  margin: 20px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  justify-content: center;
  align-items: center;
`;

export const HexText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.light ? "#FFF" : "#000")};
  text-shadow: ${(props) =>
    props.light
      ? "0px 1px 3px rgba(0,0,0,0.5)"
      : "0px 1px 3px rgba(255,255,255,0.5)"};
`;

export const ModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled(View)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
`;

export const ColorInput = styled(TextInput)`
  height: 50px;
  border-color: #210518;
  border-width: 1px;
  border-radius: 8px;
  padding: 10px;
  font-size: 18px;
  margin-bottom: 15px;
`;

export const PaletteContainer = styled.View`
  width: 100%;
  margin-bottom: 30px;
`;

export const ColorBox = styled(TouchableOpacity)`
  width: 100%;
  height: 80px;
  margin-bottom: 12px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const LogoutButton = styled(TouchableOpacity)`
  background-color: #210518;
  padding: 12px 30px;
  border-radius: 25px;
  align-self: center;
  margin-top: 20px;
`;

export const LogoutButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;