import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { handleLogout } from '../../utils/authHelper';
// Si tienes vector-icons instalado usa Iconos, si no, usa Emojis.
// Usaré Emojis para asegurar que te funcione sin instalar nada extra por ahora.

export default function AdminHome({ navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => handleLogout(navigation)} title="Salir" color="red" />
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Panel de Control</Text>
            <Text style={styles.subtitle}>Selecciona una opción para gestionar</Text>

            <View style={styles.grid}>
                {/* Tarjeta Cursos */}
                <TouchableOpacity 
                    style={[styles.card, styles.cardCourses]} 
                    onPress={() => navigation.navigate('AdminCourses')}
                >
                    <Text style={styles.icon}>📚</Text>
                    <Text style={styles.cardTitle}>Gestionar Cursos</Text>
                    <Text style={styles.cardDesc}>Crear, editar y matricular</Text>
                </TouchableOpacity>

                {/* Tarjeta Estudiantes */}
                <TouchableOpacity 
                    style={[styles.card, styles.cardStudents]} 
                    onPress={() => navigation.navigate('AdminStudents')}
                >
                    <Text style={styles.icon}>👨‍🎓</Text>
                    <Text style={styles.cardTitle}>Estudiantes</Text>
                    <Text style={styles.cardDesc}>Ver lista y crear nuevos</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f2f5', justifyContent: 'center' },
    welcome: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
    
    grid: { flexDirection: 'row', justifyContent: 'space-between' },
    
    card: {
        width: '48%',
        aspectRatio: 0.9,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // Sombras bonitas (Elevation para Android, Shadow para iOS)
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardCourses: { borderBottomWidth: 5, borderBottomColor: '#007BFF' },
    cardStudents: { borderBottomWidth: 5, borderBottomColor: '#28a745' },

    icon: { fontSize: 50, marginBottom: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' },
    cardDesc: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 5 },
});