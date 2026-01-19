import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Button } from 'react-native';
import { coursesApi, authApi } from '../../api/api';

export default function EnrollStudent({ route, navigation }) {
    const { courseId } = route.params;
    
    const [allStudents, setAllStudents] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Traemos TODOS los estudiantes
            const allUsersRes = await authApi.getUsers();
            
            // 2. Traemos SOLO los matriculados en este curso
            const enrolledRes = await coursesApi.getEnrolledStudents(courseId);

            setAllStudents(allUsersRes.data || []);
            
            const enrolledData = enrolledRes.data || [];
            // Normalizamos los IDs
            const ids = enrolledData.map(item => {
                if (typeof item === 'object') {
                    return item.student_id || item.id || item; 
                }
                return item;
            });

            setEnrolledIds(ids);

        } catch (error) {
            console.error("Error cargando datos:", error);
            setEnrolledIds([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (studentId) => {
        try {
            await coursesApi.enroll({ studentId, courseId });
            setEnrolledIds(prev => [...prev, studentId]);
        } catch (error) {
            Alert.alert("Error", "No se pudo matricular");
        }
    };

    const handleUnenroll = async (studentId) => {
        try {
            await coursesApi.unenroll({ studentId, courseId });
            setEnrolledIds(prev => prev.filter(id => id !== studentId));
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar del curso");
        }
    };

    // --- NUEVA LÓGICA: ELIMINAR CURSO COMPLETO ---
    const handleDeleteCourse = () => {
        Alert.alert(
            "Eliminar Curso Definitivamente",
            "¿Estás seguro? Esta acción borrará el curso para siempre.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await coursesApi.delete(courseId);
                            Alert.alert("Éxito", "Curso eliminado");
                            navigation.goBack(); // Regresa al Dashboard
                        } catch (error) {
                            Alert.alert("Error", "Hubo un problema al eliminar el curso.");
                        }
                    }
                }
            ]
        );
    };

    const renderStudent = ({ item }) => {
        const isEnrolled = enrolledIds.includes(item.id);

        return (
            <View style={styles.card}>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.email}</Text> 
                </View>

                {isEnrolled ? (
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnUnenroll]} 
                        onPress={() => handleUnenroll(item.id)}
                    >
                        <Text style={styles.btnText}>Quitar ❌</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnEnroll]} 
                        onPress={() => handleEnroll(item.id)}
                    >
                        <Text style={styles.btnText}>Añadir ✅</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Footer de la lista: Aquí ponemos la "Zona de Peligro"
    const renderFooter = () => {
        if (loading) return null;

        const hasStudents = enrolledIds.length > 0;

        return (
            <View style={styles.footerContainer}>
                <Text style={styles.sectionTitle}>Zona de Administración</Text>
                
                {hasStudents ? (
                    <View style={styles.warningBox}>
                        <Text style={styles.warningText}>
                            ⚠️ No puedes eliminar este curso porque tiene {enrolledIds.length} estudiante(s) matriculado(s).
                        </Text>
                        <Text style={styles.hintText}>
                            Quítalos de la lista de arriba primero para habilitar la eliminación.
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.deleteButton} 
                        onPress={handleDeleteCourse}
                    >
                        <Text style={styles.deleteButtonText}>🗑 ELIMINAR CURSO (VACÍO)</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading) return <ActivityIndicator size="large" style={{marginTop: 50}} />;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Gestión del Curso</Text>
                <Text style={styles.subHeader}>ID: {courseId.split('-')[0]}...</Text>
            </View>

            <FlatList
                data={allStudents}
                keyExtractor={(item) => item.id}
                renderItem={renderStudent}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListFooterComponent={renderFooter} // <--- Aquí inyectamos el botón al final
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
    headerContainer: { marginBottom: 15 },
    header: { fontSize: 22, fontWeight: 'bold' },
    subHeader: { fontSize: 14, color: 'gray' },
    
    card: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 1 
    },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '500' },
    
    btn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
    btnEnroll: { backgroundColor: '#e8f5e9', borderWidth: 1, borderColor: '#28a745' },
    btnUnenroll: { backgroundColor: '#fce4ec', borderWidth: 1, borderColor: '#dc3545' },
    btnText: { color: '#333', fontWeight: 'bold', fontSize: 12 },

    // Estilos del Footer (Zona de Peligro)
    footerContainer: { marginTop: 30, borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    
    warningBox: { backgroundColor: '#fff3cd', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ffeeba' },
    warningText: { color: '#856404', fontWeight: 'bold', marginBottom: 5 },
    hintText: { color: '#856404', fontSize: 12 },

    deleteButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, alignItems: 'center' },
    deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});