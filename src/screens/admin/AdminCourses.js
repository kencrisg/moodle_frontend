import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { coursesApi } from "../../api/api";
import { handleLogout } from "../../utils/authHelper";

export default function AdminDashboard({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => handleLogout(navigation)}
          title="Salir"
          color="red"
        />
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      loadCourses();
    }, []),
  );

  const loadCourses = async () => {
    try {
      const res = await coursesApi.getAll();
      const coursesClean = res.data.map((c) => ({
        ...c,
        isActive: c.isActive === undefined ? true : c.isActive,
      }));
      setCourses(coursesClean);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (id, currentIsActive) => {
    const newIsActive = !currentIsActive;
    const actionText = newIsActive ? "Activar" : "Desactivar";

    try {
      await coursesApi.updateStatus(id, newIsActive);
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: newIsActive } : c)),
      );
      Alert.alert("Éxito", `Curso ${actionText.toLowerCase()} correctamente.`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `No se pudo ${actionText.toLowerCase()} el curso.`);
    }
  };

  const filteredCourses = courses.filter((c) =>
    activeTab === "active" ? c.isActive === true : c.isActive === false,
  );

  const renderCourse = ({ item }) => {
    const isCourseActive = item.isActive;

    return (
      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.courseTitle}>{item.title}</Text>

          {/* Quitamos el contador de alumnos que estaba en 0 */}
          <Text
            style={[
              styles.statusBadge,
              { color: isCourseActive ? "green" : "gray" },
            ]}
          >
            {isCourseActive ? "● Estado: Activo" : "● Estado: Inactivo"}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          {/* CAMBIO IMPORTANTE: 
                        El botón "Gestionar" (antes Alumnos) ahora aparece SIEMPRE.
                        Esto permite entrar al curso para borrarlo si está vacío, 
                        o para quitar alumnos si está inactivo.
                    */}
          <TouchableOpacity
            style={[styles.btn, styles.btnEnroll]}
            onPress={() =>
              navigation.navigate("EnrollStudent", { courseId: item.id })
            }
          >
            <Text style={styles.btnText}>Gestionar ⚙️</Text>
          </TouchableOpacity>

          {/* Botón Activar/Desactivar */}
          <TouchableOpacity
            style={[
              styles.btn,
              isCourseActive ? styles.btnWarning : styles.btnSuccess,
            ]}
            onPress={() => toggleStatus(item.id, isCourseActive)}
          >
            <Text style={styles.btnText}>
              {isCourseActive ? "Desactivar 🔒" : "Activar 🔓"}
            </Text>
          </TouchableOpacity>

          {/* ELIMINADO: El botón de "Eliminar" del Dashboard se quitó.
                        Ahora la eliminación se hace DENTRO de "Gestionar" de forma segura.
                    */}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Panel de Administración</Text>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Activos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "inactive" && styles.activeTab]}
          onPress={() => setActiveTab("inactive")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "inactive" && styles.activeTabText,
            ]}
          >
            Inactivos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
        refreshing={false}
        onRefresh={loadCourses}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay cursos en esta sección.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateCourse")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#333" },

  tabsContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 2,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 6 },
  activeTab: { backgroundColor: "white", elevation: 2 },
  tabText: { fontWeight: "600", color: "#666" },
  activeTabText: { color: "#007BFF", fontWeight: "bold" },

  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  infoContainer: { marginBottom: 10 },
  courseTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  statusBadge: { fontSize: 12, marginTop: 4, fontWeight: "600" },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
  },
  btnEnroll: { backgroundColor: "#007BFF" }, // Azul para gestionar
  btnSuccess: { backgroundColor: "#28a745" }, // Verde para activar
  btnWarning: { backgroundColor: "#ffc107" }, // Amarillo para desactivar

  btnText: { color: "white", fontWeight: "bold", fontSize: 12 },

  emptyText: { textAlign: "center", marginTop: 20, color: "gray" },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#007BFF",
    borderRadius: 30,
    elevation: 8,
  },
  fabText: { fontSize: 30, color: "white", marginTop: -2 },
});
