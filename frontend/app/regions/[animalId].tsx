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
import { useRouter, useLocalSearchParams } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Region {
  id: string;
  name: string;
  description: string;
  icon: string;
  bone_count: number;
}

export default function RegionsScreen() {
  const router = useRouter();
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegions();
  }, [animalId]);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/regions/${animalId}`);
      if (!response.ok) throw new Error('Error al cargar regiones');
      const data = await response.json();
      setRegions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getRegionIcon = (icon: string): keyof typeof Ionicons.glyphMap => {
    switch (icon) {
      case 'skull':
        return 'skull-outline';
      case 'spine':
        return 'git-branch-outline';
      case 'ribs':
        return 'layers-outline';
      case 'arm':
        return 'hand-left-outline';
      case 'leg':
        return 'footsteps-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getRegionColor = (index: number): string => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    return colors[index % colors.length];
  };

  const handleRegionSelect = (region: Region) => {
    router.push(`/exam/${animalId}/${region.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Cargando regiones...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Caballo</Text>
          <Text style={styles.headerSubtitle}>Equus caballus</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Instructions */}
        <View style={styles.instructionContainer}>
          <Ionicons name="body-outline" size={32} color="#4ECDC4" />
          <Text style={styles.instructionTitle}>Selecciona una Región Anatómica</Text>
          <Text style={styles.instructionText}>
            Elige la región del sistema óseo que deseas estudiar
          </Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchRegions}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.regionList}>
            {regions.map((region, index) => (
              <TouchableOpacity
                key={region.id}
                style={styles.regionCard}
                onPress={() => handleRegionSelect(region)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.regionIconContainer,
                  { backgroundColor: `${getRegionColor(index)}20` }
                ]}>
                  <Ionicons
                    name={getRegionIcon(region.icon)}
                    size={32}
                    color={getRegionColor(index)}
                  />
                </View>
                <View style={styles.regionInfo}>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <Text style={styles.regionDescription}>{region.description}</Text>
                  <View style={styles.boneCountContainer}>
                    <Ionicons name="fitness-outline" size={14} color="#4ECDC4" />
                    <Text style={styles.boneCount}>{region.bone_count} huesos</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Study Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={20} color="#FFEAA7" />
            <Text style={styles.tipTitle}>Consejo de Estudio</Text>
          </View>
          <Text style={styles.tipText}>
            Comienza con las extremidades para familiarizarte con los huesos más
            comunes en la práctica clínica veterinaria.
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
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  instructionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  regionList: {
    marginBottom: 24,
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  regionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  regionDescription: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  boneCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boneCount: {
    fontSize: 12,
    color: '#4ECDC4',
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
  tipsContainer: {
    backgroundColor: 'rgba(255, 234, 167, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFEAA7',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFEAA7',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 20,
  },
});
