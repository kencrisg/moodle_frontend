import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { coursesApi } from '../../api/api';

export default function EnrollStudent({ route, navigation }) {
    const { courseId } = route.params;
    const [userId, setUserId] = useState('');

    const handleEnroll = async () => {
        try {
            // Ajustamos el payload según tu backend
            await coursesApi.enroll({ studentId: userId, courseId: courseId });
            Alert.alert('Éxito', 'Estudiante matriculado');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Falló la matriculación');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>ID del Estudiante</Text>
            <TextInput 
                style={styles.input} 
                value={userId} 
                onChangeText={setUserId} 
                placeholder="UUID del usuario..."
            />
            <Button title="Matricular" onPress={handleEnroll} />
            <View style={{marginTop: 10}}>
                <Button title="Volver" color="gray" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
}
// Usa los mismos estilos que CreateCourse
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    label: { fontSize: 16, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5, backgroundColor: '#fff' }
});