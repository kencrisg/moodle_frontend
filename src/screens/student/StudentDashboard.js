import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { coursesApi } from '../../api/api';

export default function StudentDashboard({ navigation }) {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // NOTA: Aquí deberías filtrar por los cursos donde el estudiante está inscrito.
        // Como el backend 'getCourses' devuelve todo, por ahora mostraremos todo.
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const res = await coursesApi.getAll();
            setCourses(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis Cursos</Text>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('CourseDetail', { course: item })}
                    >
                        <Text style={styles.courseTitle}>{item.title}</Text>
                        <Text style={styles.cta}>Ver clase ▶</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { padding: 20, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2 },
    courseTitle: { fontSize: 18, fontWeight: 'bold' },
    cta: { marginTop: 5, color: '#007BFF' }
});