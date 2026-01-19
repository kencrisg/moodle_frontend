import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { authApi } from "../../api/api";

export default function CreateStudent({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  // Switch activo (true) enviará 'a', inactivo (false) enviará 's'
  const [isAdmin, setIsAdmin] = useState(false);

  const handleCreate = async () => {
    if (!email || !password || !fullName) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      // Construimos el objeto exactamente como en tus capturas de Postman
      const userData = {
        email,
        password,
        fullName,
        role: isAdmin ? "a" : "s", // Mapeo de Switch a rol
      };

      await authApi.createUser(userData);
      Alert.alert(
        "Éxito",
        `Usuario (${isAdmin ? "Admin" : "Estudiante"}) registrado correctamente`,
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo crear el usuario. Revisa la consola.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registro de Usuarios</Text>

      <Text style={styles.label}>Nombre Completo</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Ej. Cristian Castro"
      />

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.roleRow}>
        <Text style={styles.roleLabel}>
          Tipo de Usuario:{" "}
          <Text style={styles.roleValue}>
            {isAdmin ? "Administrador (a)" : "Estudiante (s)"}
          </Text>
        </Text>
        <Switch
          value={isAdmin}
          onValueChange={setIsAdmin}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isAdmin ? "#007BFF" : "#f4f3f4"}
        />
      </View>

      <Button title="Guardar Usuario" onPress={handleCreate} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  roleLabel: { fontSize: 14, fontWeight: "500" },
  roleValue: { color: "#007BFF", fontWeight: "bold" },
});
