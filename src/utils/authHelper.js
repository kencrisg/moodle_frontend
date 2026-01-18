import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleLogout = async (navigation) => {
    try {
        // Borramos todo rastro de la sesión
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userRole');
        
        // Redirigimos al Login y borramos el historial para que no puedan volver atrás
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    } catch (error) {
        console.error("Error al salir:", error);
    }
};