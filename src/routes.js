import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
<<<<<<< HEAD
import LoginScreen from "./pages/LoginScreen";
import DashboardScreen from "./pages/Dashboard/DashboardScreen";
=======
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";
import Main from "./pages/main"; 
import GerarCor from "./pages/gerarCor";
import GerarPaleta from "./pages/gerarPaleta"; 
>>>>>>> b2b245edd1ca29f02465997dfc0ec5cb0e6425c6

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
<<<<<<< HEAD
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ title: "Menu Principal" }}
      />
    </Stack.Navigator>
  );
}
