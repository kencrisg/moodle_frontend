import React, { useState, useLayoutEffect, useCallback } from 'react'; // <--- Agrega useCallback
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // <--- IMPORTANTE: Importar esto
import { coursesApi } from '../../api/api';
import { handleLogout } from '../../utils/authHelper';

export default function AdminDashboard({ navigation }) {
    const [courses, setCourses] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => handleLogout(navigation)} title="Salir" color="red" />
            ),
        });
    }, [navigation]);

    // CAMBIO CLAVE: Usamos useFocusEffect en lugar de useEffect
    // Esto recargará los cursos cada vez que "mires" esta pantalla
    useFocusEffect(
        useCallback(() => {
            loadCourses();
        }, [])
    );

    const loadCourses = async () => {
        try {
            const res = await coursesApi.getAll();
            setCourses(res.data);
        } catch (error) {
            console.error(error); // Silencioso para no molestar al usuario con alertas constantes
        }
    };

    const handleDelete = (id, title) => {
        Alert.alert(
            "Eliminar Curso",
            `¿Estás seguro de que quieres eliminar "${title}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await coursesApi.delete(id);
                            
                            // OPCIÓN A: Actualización Optimista (Más rápida visualmente)
                            // Filtramos la lista localmente para quitar el item borrado
                            setCourses(prev => prev.filter(c => c.id !== id)); 
                            
                            // OPCIÓN B: Si prefieres estar 100% seguro, recarga todo:
                            // loadCourses(); 

                            Alert.alert("Éxito", "Curso eliminado");
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar");
                        }
                    }
                }
            ]
        );
    };

    // ... El resto del renderizado (FlatList, etc) sigue igual ...
    const renderCourse = ({ item }) => (
        <View style={styles.card}>
             <View style={styles.infoContainer}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.status}>Estado: Activo</Text> 
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={[styles.btn, styles.btnEnroll]} 
                    onPress={() => navigation.navigate('EnrollStudent', { courseId: item.id })}
                >
                    <Text style={styles.btnText}>Matricular</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.btn, styles.btnDelete]} 
                    onPress={() => handleDelete(item.id, item.title)}
                >
                    <Text style={styles.btnText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* ... Tu código de UI ... */}
            <Text style={styles.header}>Panel de Administración</Text>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id}
                renderItem={renderCourse}
                // Agregamos esto para que puedas jalar hacia abajo para refrescar manualmente también
                refreshing={false}
                onRefresh={loadCourses}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => navigation.navigate('CreateCourse')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

// ... Estilos (styles) siguen igual
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    card: { backgroundColor: 'white', padding: 15, marginBottom: 12, borderRadius: 10, elevation: 3 },
    infoContainer: { marginBottom: 10 },
    courseTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    status: { color: 'green', fontSize: 12, marginTop: 2 },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
    btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, minWidth: '48%', alignItems: 'center' },
    btnEnroll: { backgroundColor: '#007BFF' },
    btnDelete: { backgroundColor: '#FF3B30' },
    btnText: { color: 'white', fontWeight: '600', fontSize: 14 },
    fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#007BFF', borderRadius: 30, elevation: 8 },
    fabText: { fontSize: 30, color: 'white', marginTop: -2 }
});