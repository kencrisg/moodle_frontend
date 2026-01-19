import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react'; // <--- Agregado useLayoutEffect
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from 'react-native'; // <--- Agregado Button
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { coursesApi } from '../../api/api';
import { handleLogout } from '../../utils/authHelper'; // <--- Importamos tu utilidad de logout

export default function StudentDashboard({ navigation }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Agregamos el botón "Salir" al header de la pantalla
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button 
                    onPress={() => handleLogout(navigation)} 
                    title="Salir" 
                    color="red" 
                />
            ),
        });
    }, [navigation]);

    // 2. Cargamos los cursos vinculados al estudiante
    useFocusEffect(
        useCallback(() => {
            loadMyCourses();
        }, [])
    );

    const loadMyCourses = async () => {
        setLoading(true);
        try {
            const studentId = await AsyncStorage.getItem('userId'); //
            if (studentId) {
                const res = await coursesApi.getMyCourses(studentId); //
                // Filtramos solo los cursos que el admin tiene marcados como activos
                const activeCourses = res.data.filter(c => c.isActive);
                setCourses(activeCourses);
            }
        } catch (error) {
            console.error("Error cargando mis cursos:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('CourseDetail', { course: item })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Matriculado</Text>
                </View>
            </View>
            <Text style={styles.cta}>Ingresar al curso →</Text>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 50 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis Clases</Text>
            
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aún no tienes cursos asignados.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#212529' },
    card: { backgroundColor: 'white', padding: 20, marginBottom: 15, borderRadius: 15, elevation: 4 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    courseTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
    badge: { backgroundColor: '#d4edda', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
    badgeText: { color: '#155724', fontSize: 10, fontWeight: 'bold' },
    cta: { color: '#007BFF', fontWeight: '600', fontSize: 14 },
    emptyContainer: { marginTop: 100, alignItems: 'center' },
    emptyText: { color: '#6c757d', fontSize: 16, textAlign: 'center' }
});