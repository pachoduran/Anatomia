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
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Animal {
  id: string;
  name: string;
  name_scientific: string;
  description: string;
  icon: string;
  total_bones: number;
  available: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/animals`);
      if (!response.ok) throw new Error('Error al cargar animales');
      const data = await response.json();
      setAnimals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getAnimalIcon = (icon: string) => {
    switch (icon) {
      case 'horse':
        return 'accessibility-outline';
      case 'cow':
        return 'paw-outline';
      case 'pig':
        return 'ellipse-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const handleAnimalSelect = (animal: Animal) => {
    if (animal.available) {
      router.push(`/regions/${animal.id}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
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
          <View style={styles.logoContainer}>
            <Ionicons name="fitness-outline" size={48} color="#4ECDC4" />
          </View>
          <Text style={styles.title}>VetBones</Text>
          <Text style={styles.subtitle}>Sistema Óseo Veterinario</Text>
          <Text style={styles.description}>
            Aplicación de estudio anatómico para profesionales veterinarios
          </Text>
        </View>

        {/* Animal Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona un Animal</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchAnimals}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.animalGrid}>
              {animals.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={[
                    styles.animalCard,
                    !animal.available && styles.animalCardDisabled,
                  ]}
                  onPress={() => handleAnimalSelect(animal)}
                  disabled={!animal.available}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.animalIconContainer,
                    !animal.available && styles.iconDisabled
                  ]}>
                    <Ionicons
                      name={getAnimalIcon(animal.icon) as any}
                      size={40}
                      color={animal.available ? '#4ECDC4' : '#666'}
                    />
                  </View>
                  <Text style={[
                    styles.animalName,
                    !animal.available && styles.textDisabled
                  ]}>
                    {animal.name}
                  </Text>
                  <Text style={styles.animalScientific}>
                    {animal.name_scientific}
                  </Text>
                  <Text style={styles.animalBones}>
                    {animal.total_bones} huesos
                  </Text>
                  {!animal.available && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Próximamente</Text>
                    </View>
                  )}
                  {animal.available && (
                    <View style={styles.availableBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                      <Text style={styles.availableText}>Disponible</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Ionicons name="information-circle-outline" size={24} color="#4ECDC4" />
          <Text style={styles.infoText}>
            Selecciona un animal para comenzar a estudiar su sistema óseo mediante
            exámenes de selección múltiple con imágenes anatómicas reales.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

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
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#4ECDC4',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  animalGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  animalCard: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    flexDirection: 'row',
  },
  animalCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#12192e',
  },
  animalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconDisabled: {
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
  },
  animalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  animalScientific: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  animalBones: {
    fontSize: 14,
    color: '#4ECDC4',
    marginBottom: 8,
  },
  textDisabled: {
    color: '#666',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  comingSoonText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  availableText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    color: '#aaa',
    fontSize: 14,
    marginLeft: 12,
    lineHeight: 20,
  },
});
