import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";

export default function CourseDetailScreen({ route, navigation }) {
    const { course } = route.params;
    const [playing, setPlaying] = useState(false);

    // Función mejorada para extraer ID de YouTube
    const getVideoId = (url) => {
        if (!url) return null;
        
        // 1. Limpiamos espacios en blanco accidentales
        const cleanUrl = url.trim();

        // 2. Expresión regular que cubre:
        // - youtube.com/watch?v=ID
        // - youtu.be/ID
        // - youtube.com/embed/ID
        // - youtube.com/v/ID
        // - shorts/ID
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = cleanUrl.match(regExp);

        // El ID de YouTube siempre tiene 11 caracteres
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(course.videoUrl);

    // Log para depurar en consola si falla
    if (!videoId) {
        console.log("Error extrayendo ID de:", course.videoUrl);
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{course.title}</Text>
            
            <View style={styles.videoContainer}>
                {videoId ? (
                    <YoutubePlayer
                        height={220}
                        play={playing}
                        videoId={videoId}
                        onChangeState={(state) => {
                            if (state === "ended") setPlaying(false);
                        }}
                        // Añadir manejo de errores del reproductor
                        onError={(e) => console.log("Error del reproductor:", e)}
                    />
                ) : (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>
                            Video no disponible.
                        </Text>
                        <Text style={styles.debugText}>URL: {course.videoUrl}</Text>
                    </View>
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.subtitle}>Descripción del curso</Text>
                <Text style={styles.desc}>
                    Bienvenido a tu clase. Mira el video completo para completar el módulo.
                </Text>
            </View>

            <Button title="Volver a mis cursos" onPress={() => navigation.goBack()} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    videoContainer: { height: 220, marginBottom: 20, backgroundColor: '#000', justifyContent: 'center' },
    infoContainer: { marginBottom: 30 },
    subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
    desc: { fontSize: 16, color: '#555', lineHeight: 24 },
    errorBox: { alignItems: 'center', padding: 20 },
    errorText: { color: 'white', fontWeight: 'bold' },
    debugText: { color: 'gray', fontSize: 12, marginTop: 5 }
});