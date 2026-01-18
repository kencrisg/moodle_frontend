import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { authApi } from '../api/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // Llamada a tu backend
            const response = await authApi.login({ email, password });
            console.log('Login exitoso:', response.data);
            
            // Aquí deberías guardar el token si tu backend lo retorna
            
            // Navegar a la pantalla de Cursos
            navigation.replace('Home');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Credenciales incorrectas o error de servidor');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a Moodle</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Ingresar" onPress={handleLogin} />
            
            <Button 
                title="Registrarse" 
                onPress={() => Alert.alert('Info', 'Implementar registro aquí')} 
                color="gray"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});