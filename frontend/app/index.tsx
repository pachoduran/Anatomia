import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Animal {
  id: string;
  name: string;
  name_scientific: string;
  description: string;
  total_bones: number;
  available: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/animals`);
      const data = await response.json();
      setAnimals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="fitness-outline" size={56} color="#4ECDC4" />
          <Text style={styles.title}>VetBones</Text>
          <Text style={styles.subtitle}>Sistema Óseo Veterinario</Text>
          <Text style={styles.description}>
            Estudia la anatomía ósea de animales de granja
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>205</Text>
            <Text style={styles.statLabel}>Huesos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Divisiones</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Regiones</Text>
          </View>
        </View>

        {/* Animals */}
        <Text style={styles.sectionTitle}>Selecciona un Animal</Text>
        
        {animals.map((animal) => (
          <TouchableOpacity
            key={animal.id}
            style={[styles.animalCard, !animal.available && styles.cardDisabled]}
            onPress={() => animal.available && router.push(`/divisions/${animal.id}`)}
            disabled={!animal.available}
          >
            <View style={styles.animalIcon}>
              <Ionicons 
                name={animal.available ? "ribbon-outline" : "time-outline"} 
                size={36} 
                color={animal.available ? "#4ECDC4" : "#666"} 
              />
            </View>
            <View style={styles.animalInfo}>
              <Text style={[styles.animalName, !animal.available && styles.textDisabled]}>
                {animal.name}
              </Text>
              <Text style={styles.animalScientific}>{animal.name_scientific}</Text>
              <Text style={styles.animalBones}>{animal.total_bones} huesos</Text>
            </View>
            {animal.available ? (
              <Ionicons name="chevron-forward" size={24} color="#4ECDC4" />
            ) : (
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonText}>Próximamente</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="school-outline" size={20} color="#4ECDC4" />
          <Text style={styles.infoText}>
            Aplicación diseñada para veterinarios y estudiantes de medicina veterinaria
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#4ECDC4',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2a2a4a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  animalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  animalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  animalInfo: {
    flex: 1,
  },
  animalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  animalScientific: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  animalBones: {
    fontSize: 13,
    color: '#4ECDC4',
    marginTop: 4,
  },
  textDisabled: {
    color: '#666',
  },
  comingSoon: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comingSoonText: {
    color: '#FF6B6B',
    fontSize: 11,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    color: '#aaa',
    fontSize: 13,
    marginLeft: 12,
  },
});
