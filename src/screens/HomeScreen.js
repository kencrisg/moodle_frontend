import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { coursesApi } from '../api/api';

export default function HomeScreen() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const response = await coursesApi.getAll();
            setCourses(response.data); // Asumiendo que response.data es el array de cursos
        } catch (error) {
            console.error('Error cargando cursos:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cursos Disponibles</Text>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id || item._id} // Ajusta según tu DB
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.courseTitle}>{item.title}</Text>
                        <Text>Video: {item.videoUrl}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 8, elevation: 2 },
    courseTitle: { fontSize: 18, fontWeight: 'bold' },
});