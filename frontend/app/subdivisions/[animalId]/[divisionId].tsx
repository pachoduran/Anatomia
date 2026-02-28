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
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Subdivision {
  id: string;
  name: string;
  description: string;
  total_bones: number;
  image_url: string;
}

export default function SubdivisionsScreen() {
  const router = useRouter();
  const { animalId, divisionId } = useLocalSearchParams<{ 
    animalId: string; 
    divisionId: string;
  }>();
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [loading, setLoading] = useState(true);

  const divisionName = divisionId === 'axial' ? 'Esqueleto Axial' : 'Esqueleto Apendicular';
  const divisionColor = divisionId === 'axial' ? '#4ECDC4' : '#FF6B6B';

  useEffect(() => {
    fetchSubdivisions();
  }, []);

  const fetchSubdivisions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subdivisions/${animalId}/${divisionId}`);
      const data = await response.json();
      setSubdivisions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (id: string): keyof typeof Ionicons.glyphMap => {
    if (id.includes('craneo')) return 'skull-outline';
    if (id.includes('columna')) return 'git-branch-outline';
    if (id.includes('toraci')) return 'layers-outline';
    if (id.includes('toracico') || id.includes('anterior')) return 'hand-left-outline';
    if (id.includes('pelvico') || id.includes('posterior')) return 'footsteps-outline';
    return 'ellipse-outline';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={divisionColor} />
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
          <Text style={styles.headerTitle}>{divisionName}</Text>
          <Text style={[styles.headerSubtitle, { color: divisionColor }]}>
            {divisionId === 'axial' ? '81 huesos' : '120 huesos'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Selecciona una región</Text>

        {subdivisions.map((sub, index) => (
          <TouchableOpacity
            key={sub.id}
            style={styles.card}
            onPress={() => router.push(`/exam-new/${animalId}/${divisionId}/${sub.id}`)}
          >
            {/* Preview Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: sub.image_url }}
                style={styles.previewImage}
                contentFit="cover"
              />
              <View style={styles.imageOverlay}>
                <Ionicons name={getIcon(sub.id)} size={32} color="#fff" />
              </View>
            </View>
            
            {/* Info */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{sub.name}</Text>
              <Text style={styles.cardDesc}>{sub.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.bonesBadge}>
                  <Ionicons name="fitness" size={14} color={divisionColor} />
                  <Text style={[styles.bonesText, { color: divisionColor }]}>
                    {sub.total_bones} huesos
                  </Text>
                </View>
                <View style={styles.examButton}>
                  <Text style={styles.examButtonText}>Iniciar Examen</Text>
                  <Ionicons name="play" size={14} color="#fff" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bonesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonesText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  examButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  examButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
  },
});
