import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { coursesApi } from '../../api/api';

export default function CreateCourse({ navigation }) {
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const handleCreate = async () => {
        if (!title || !videoUrl) return Alert.alert('Error', 'Completa todos los campos');
        try {
            await coursesApi.create({ title, videoUrl });
            Alert.alert('Éxito', 'Curso creado correctamente');
            navigation.goBack(); // Regresa al Dashboard y actualiza
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear el curso');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título del Curso</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>URL de YouTube</Text>
            <TextInput 
                style={styles.input} 
                value={videoUrl} 
                onChangeText={setVideoUrl} 
                placeholder="https://youtube.com/..." 
            />

            <Button title="Guardar Curso" onPress={handleCreate} />
            <View style={{marginTop: 10}}>
                <Button title="Cancelar" color="red" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5, backgroundColor: '#fff' }
});