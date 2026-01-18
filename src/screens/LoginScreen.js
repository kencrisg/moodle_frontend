import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importante para guardar sesión
import { authApi } from '../api/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Para mostrar que está cargando

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa correo y contraseña');
            return;
        }

        setLoading(true);

        try {
            // 1. Hacemos la petición al backend
            const response = await authApi.login({ email, password });
            const data = response.data;

            console.log('Respuesta del server:', data); // Para depuración

            // 2. Guardamos los datos críticos en el almacenamiento del celular
            // Guardamos el token por si necesitas hacer peticiones autenticadas después
            // Guardamos el ID por si necesitamos saber quién es el usuario actual
            await AsyncStorage.setItem('userToken', data.token);
            await AsyncStorage.setItem('userId', data.id);
            await AsyncStorage.setItem('userRole', data.role);

            // 3. Lógica de Redirección basada en el ROL ('a' o 's')
            if (data.role === 'a') {
                // Es Admin -> Vamos al Dashboard de Admin
                navigation.replace('AdminHome');
            } else if (data.role === 's') {
                // Es Student -> Vamos al Dashboard de Estudiante
                navigation.replace('StudentHome');
            } else {
                // Rol desconocido
                Alert.alert('Error', 'Rol de usuario desconocido: ' + data.role);
            }

        } catch (error) {
            console.error(error);
            // Manejo básico de errores (401, 500, etc.)
            if (error.response && error.response.status === 401) {
                Alert.alert('Error', 'Credenciales incorrectas');
            } else {
                Alert.alert('Error', 'No se pudo conectar con el servidor');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Moodle Login</Text>
            
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
                style={styles.input}
                placeholder="admin@test.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="******"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Ingresar" onPress={handleLogin} />
            )}
            
            {/* Botón temporal para pruebas rápidas de registro */}
            <View style={{marginTop: 20}}>
                <Button 
                    title="Crear cuenta (Registro)" 
                    onPress={() => Alert.alert('Info', 'Implementar vista de registro')} 
                    color="gray"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
    label: { marginBottom: 5, fontWeight: '600', color: '#555' },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 12, 
        marginBottom: 20, 
        borderRadius: 8, 
        backgroundColor: '#fff' 
    },
});