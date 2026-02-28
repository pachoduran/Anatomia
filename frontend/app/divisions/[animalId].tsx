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

interface Division {
  id: string;
  name: string;
  description: string;
  total_bones: number;
  icon: string;
}

export default function DivisionsScreen() {
  const router = useRouter();
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/divisions/${animalId}`);
      const data = await response.json();
      setDivisions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (icon: string): keyof typeof Ionicons.glyphMap => {
    switch (icon) {
      case 'body': return 'body-outline';
      case 'walk': return 'walk-outline';
      default: return 'help-circle-outline';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Caballo</Text>
          <Text style={styles.headerSubtitle}>205 huesos</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="git-branch-outline" size={32} color="#4ECDC4" />
          <Text style={styles.infoTitle}>Divisiones del Esqueleto</Text>
          <Text style={styles.infoText}>
            El esqueleto equino se divide en dos partes principales
          </Text>
        </View>

        {/* Divisions */}
        {divisions.map((division, index) => (
          <TouchableOpacity
            key={division.id}
            style={[
              styles.divisionCard,
              { borderLeftColor: index === 0 ? '#4ECDC4' : '#FF6B6B' }
            ]}
            onPress={() => router.push(`/subdivisions/${animalId}/${division.id}`)}
          >
            <View style={[
              styles.divisionIcon,
              { backgroundColor: index === 0 ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)' }
            ]}>
              <Ionicons 
                name={getIcon(division.icon)} 
                size={40} 
                color={index === 0 ? '#4ECDC4' : '#FF6B6B'} 
              />
            </View>
            <View style={styles.divisionInfo}>
              <Text style={styles.divisionName}>{division.name}</Text>
              <Text style={styles.divisionDesc}>{division.description}</Text>
              <View style={styles.boneCount}>
                <Ionicons name="fitness" size={14} color="#4ECDC4" />
                <Text style={styles.boneCountText}>{division.total_bones} huesos</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Estructura:</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
            <Text style={styles.legendText}>Axial: Cráneo, columna, tórax</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.legendText}>Apendicular: Extremidades</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4ECDC4',
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  divisionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  divisionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  divisionInfo: {
    flex: 1,
  },
  divisionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  divisionDesc: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  boneCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boneCountText: {
    fontSize: 13,
    color: '#4ECDC4',
    marginLeft: 6,
  },
  legend: {
    backgroundColor: 'rgba(78, 205, 196, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    color: '#aaa',
  },
});
