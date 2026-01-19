import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { authApi } from '../../api/api';

export default function AdminUsers({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadUsers();
        }, [])
    );

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await authApi.getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudieron cargar los usuarios.");
        } finally {
            setLoading(false);
        }
    };


    const renderUser = ({ item }) => {
        const isAmin = item.role === 'a';
        // Ajustamos para leer user_id o id según lo que devuelva tu View
        const userId = item.user_id || item.id;

        return (
            <View style={styles.card}>
                <View style={[styles.avatar, isAmin ? styles.avatarAdmin : styles.avatarStudent]}>
                    <Text style={styles.avatarText}>
                        {item.fullName ? item.fullName.charAt(0).toUpperCase() : '?'}
                    </Text>
                </View>

                <View style={styles.info}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <View style={[styles.badge, isAmin ? styles.badgeAdmin : styles.badgeStudent]}>
                        <Text style={styles.badgeText}>{isAmin ? 'ADMIN' : 'ESTUDIANTE'}</Text>
                    </View>
                </View>

                
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Directorio de Usuarios</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.user_id || item.id}
                    renderItem={renderUser}
                    ListEmptyComponent={<Text style={styles.empty}>No hay usuarios registrados.</Text>}
                />
            )}

            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => navigation.navigate('CreateStudent')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1a1a1a' },
    card: { 
        flexDirection: 'row', backgroundColor: 'white', padding: 15, marginBottom: 12, 
        borderRadius: 15, elevation: 3, alignItems: 'center'
    },
    avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    avatarAdmin: { backgroundColor: '#ffd7d7' },
    avatarStudent: { backgroundColor: '#d7e3ff' },
    avatarText: { fontSize: 18, fontWeight: 'bold' },
    
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    email: { fontSize: 13, color: '#666' },
    
    badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 5 },
    badgeAdmin: { backgroundColor: '#ff4d4d' },
    badgeStudent: { backgroundColor: '#007bff' },
    badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

    deleteIcon: { padding: 10 },
    fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#28a745', justifyContent: 'center', alignItems: 'center', elevation: 5 },
    fabText: { color: 'white', fontSize: 30 },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});