// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas
import LoginScreen from './src/screens/LoginScreen';

// Admin
import AdminDashboard from './src/screens/admin/AdminDashboard';
import CreateCourse from './src/screens/admin/CreateCourse';
import EnrollStudent from './src/screens/admin/EnrollStudent';

// Student
import StudentDashboard from './src/screens/student/StudentDashboard';
import CourseDetailScreen from './src/screens/student/CourseDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

        {/* Admin Flow */}
        <Stack.Screen name="AdminHome" component={AdminDashboard} options={{ title: 'Admin - Cursos' }} />
        <Stack.Screen name="CreateCourse" component={CreateCourse} options={{ title: 'Nuevo Curso' }} />
        <Stack.Screen name="EnrollStudent" component={EnrollStudent} options={{ title: 'Matricular Alumno' }} />

        {/* Student Flow */}
        <Stack.Screen name="StudentHome" component={StudentDashboard} options={{ title: 'Mis Clases' }} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Aula Virtual' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}