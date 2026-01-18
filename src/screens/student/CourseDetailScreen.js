import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";

export default function CourseDetailScreen({ route, navigation }) {
    const { course } = route.params; // Recibimos el curso seleccionado
    const [playing, setPlaying] = useState(false);

    // Función auxiliar para sacar el ID del video de la URL
    const getVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(course.videoUrl);

    return (
        <View style={styles.container}>
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
                    />
                ) : (
                    <Text style={styles.errorText}>Video no disponible o URL inválida</Text>
                )}
            </View>

            <Text style={styles.desc}>Aquí puedes ver el contenido de tu clase.</Text>

            {/* El botón de regresar ya lo pone el navegador arriba, 
                pero si quieres uno explícito abajo: */}
            <Button title="Regresar a mis cursos" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    videoContainer: { marginTop: 10, marginBottom: 20 },
    errorText: { color: 'red', textAlign: 'center' },
    desc: { fontSize: 16, color: '#555', marginBottom: 30 },
});