import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { coursesApi } from '../../api/api';

export default function AdminDashboard({ navigation }) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const res = await coursesApi.getAll();
            setCourses(res.data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los cursos');
        }
    };

    // Renderizado de cada curso en la lista
    const renderCourse = ({ item }) => (
        <View style={styles.card}>
            <View>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.status}>Estado: Activo (Simulado)</Text> 
            </View>
            <View style={styles.actions}>
                <Button 
                    title="Matricular" 
                    onPress={() => navigation.navigate('EnrollStudent', { courseId: item.id })} 
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Panel de Administración</Text>
            
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id}
                renderItem={renderCourse}
                refreshing={false}
                onRefresh={loadCourses}
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

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    card: { 
        backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 3,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    courseTitle: { fontSize: 16, fontWeight: 'bold' },
    status: { color: 'green', fontSize: 12 },
    fab: {
        position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center',
        right: 20, bottom: 20, backgroundColor: '#007BFF', borderRadius: 30, elevation: 8
    },
    fabText: { fontSize: 30, color: 'white' }
});