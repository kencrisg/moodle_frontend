import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas Auth
import LoginScreen from './src/screens/LoginScreen';

// Admin Screens
import AdminHome from './src/screens/admin/AdminHome';         // <--- NUEVO
import AdminCourses from './src/screens/admin/AdminCourses';   // <--- Antes era AdminDashboard
import AdminStudents from './src/screens/admin/AdminUsers.js'; // <--- NUEVO
import CreateStudent from './src/screens/admin/CreateStudent'; // <--- NUEVO
import CreateCourse from './src/screens/admin/CreateCourse';
import EnrollStudent from './src/screens/admin/EnrollStudent';

// Student Screens
import StudentDashboard from './src/screens/student/StudentDashboard';
import CourseDetailScreen from './src/screens/student/CourseDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

        {/* --- AREA ADMIN --- */}
        {/* El nuevo Home */}
        <Stack.Screen name="AdminHome" component={AdminHome} options={{ title: 'Inicio Admin' }} />
        
        {/* Rama de Cursos */}
        <Stack.Screen name="AdminCourses" component={AdminCourses} options={{ title: 'Gestión de Cursos' }} />
        <Stack.Screen name="CreateCourse" component={CreateCourse} options={{ title: 'Nuevo Curso' }} />
        <Stack.Screen name="EnrollStudent" component={EnrollStudent} options={{ title: 'Gestionar Alumnos' }} />

        {/* Rama de Estudiantes */}
        <Stack.Screen name="AdminStudents" component={AdminStudents} options={{ title: 'Directorio Estudiantes' }} />
        <Stack.Screen name="CreateStudent" component={CreateStudent} options={{ title: 'Registrar Nuevo Alumno' }} />

        {/* --- AREA STUDENT --- */}
        <Stack.Screen name="StudentHome" component={StudentDashboard} options={{ title: 'Mis Clases' }} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Aula Virtual' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}