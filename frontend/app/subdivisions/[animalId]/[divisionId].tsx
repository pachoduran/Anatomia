import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getLocalImage } from '../../localImages';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Region {
  id: string;
  name: string;
  desc: string;
  bones: number;
  image: string;
  has_views?: boolean;
}

export default function RegionsScreen() {
  const router = useRouter();
  const { animalId, divisionId } = useLocalSearchParams<{ animalId: string; divisionId: string }>();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  const divisionName = divisionId === 'axial' ? 'Esqueleto Axial' : 'Esqueleto Apendicular';
  const divColor = divisionId === 'axial' ? '#4ECDC4' : '#FF6B6B';

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/regions/${animalId}/${divisionId}`);
      const data = await res.json();
      setRegions(data.map((r: any) => ({ ...r, image: r.image?.startsWith('/') ? `${BACKEND_URL}${r.image}` : r.image })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (id: string): keyof typeof Ionicons.glyphMap => {
    if (id.includes('craneo')) return 'skull-outline';
    if (id.includes('columna')) return 'git-branch-outline';
    if (id.includes('torax')) return 'layers-outline';
    if (id.includes('anterior')) return 'hand-left-outline';
    if (id.includes('posterior')) return 'footsteps-outline';
    return 'body-outline';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={divColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{divisionName}</Text>
          <Text style={[styles.headerSub, { color: divColor }]}>
            {divisionId === 'axial' ? '81 huesos' : '120 huesos'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Selecciona una región para estudiar</Text>

        {regions.map((region) => (
          <View key={region.id} style={styles.card}>
            <TouchableOpacity
              style={styles.cardImageContainer}
              onPress={() => router.push(`/study/${animalId}/${divisionId}/${region.id}`)}
            >
              <Image source={getLocalImage(region.id) || { uri: region.image }} style={styles.cardImage} contentFit="cover" />
              <View style={[styles.cardOverlay, { backgroundColor: `${divColor}40` }]}>
                <Ionicons name={getIcon(region.id)} size={36} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{region.name}</Text>
              <Text style={styles.cardDesc}>{region.desc}</Text>
              
              <View style={styles.cardFooter}>
                <View style={styles.bonesBadge}>
                  <Ionicons name="fitness" size={16} color={divColor} />
                  <Text style={[styles.bonesText, { color: divColor }]}>{region.bones} huesos</Text>
                </View>
                
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={[styles.studyBtn, { borderColor: divColor }]}
                    onPress={() => router.push(`/study/${animalId}/${divisionId}/${region.id}`)}
                  >
                    <Ionicons name="book-outline" size={16} color={divColor} />
                    <Text style={[styles.studyBtnText, { color: divColor }]}>Estudiar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.examBtn, { backgroundColor: divColor }]}
                    onPress={() => router.push(`/exam-new/${animalId}/${divisionId}/${region.id}`)}
                  >
                    <Text style={styles.examBtnText}>Examen</Text>
                    <Ionicons name="play" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13 },
  
  content: { padding: 16 },
  sectionTitle: { fontSize: 15, color: '#888', marginBottom: 16 },
  
  card: { backgroundColor: '#16213e', borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  cardImageContainer: { height: 140, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#888', marginBottom: 12 },
  
  cardFooter: { marginTop: 4 },
  bonesBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  bonesText: { marginLeft: 6, fontWeight: '500', fontSize: 14 },
  
  btnRow: { flexDirection: 'row' },
  studyBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 2, marginRight: 8 },
  studyBtnText: { fontWeight: '600', marginLeft: 6, fontSize: 14 },
  examBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  examBtnText: { color: '#fff', fontWeight: '600', marginRight: 6, fontSize: 14 },
});
