import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getLocalImage } from '../../../localImages';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface SkullView {
  id: string;
  name: string;
  desc: string;
  image: string;
  bones: number;
}

const VIEW_ICONS: { [key: string]: string } = {
  dorsal: 'arrow-up-circle',
  ventral: 'arrow-down-circle',
  lateral: 'arrow-forward-circle',
  caudal: 'arrow-back-circle',
  rostral: 'eye',
};

export default function ViewsScreen() {
  const router = useRouter();
  const { animalId, divisionId, regionId } = useLocalSearchParams<{
    animalId: string;
    divisionId: string;
    regionId: string;
  }>();

  const [views, setViews] = useState<SkullView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadViews(); }, []);

  const loadViews = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/views/${animalId}/${divisionId}/${regionId}`);
      const data = await res.json();
      setViews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Cargando vistas...</Text>
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
          <Text style={styles.headerTitle}>Cráneo y Cara</Text>
          <Text style={styles.headerSub}>5 vistas anatómicas</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Selecciona una vista para estudiar</Text>

        {views.map((v) => (
          <View key={v.id} style={styles.card}>
            <TouchableOpacity
              style={styles.cardImageWrap}
              onPress={() => router.push(`/study-view/${animalId}/${divisionId}/${regionId}/${v.id}`)}
            >
              <Image
                source={getLocalImage(regionId as string, v.id) || { uri: `${BACKEND_URL}${v.image}` }}
                style={styles.cardImage}
                contentFit="cover"
              />
              <View style={styles.cardOverlay}>
                <Ionicons name={(VIEW_ICONS[v.id] || 'eye') as any} size={32} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{v.name}</Text>
              <Text style={styles.cardDesc}>{v.desc}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.boneBadge}>
                  <Ionicons name="fitness" size={14} color="#4ECDC4" />
                  <Text style={styles.boneCount}>{v.bones} estructuras</Text>
                </View>
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.studyBtn}
                    onPress={() => router.push(`/study-view/${animalId}/${divisionId}/${regionId}/${v.id}`)}
                  >
                    <Ionicons name="book-outline" size={14} color="#4ECDC4" />
                    <Text style={styles.studyText}>Estudiar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.examBtn}
                    onPress={() => router.push(`/exam-view/${animalId}/${divisionId}/${regionId}/${v.id}`)}
                  >
                    <Text style={styles.examText}>Examen</Text>
                    <Ionicons name="play" size={14} color="#fff" />
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
  loadingText: { color: '#888', marginTop: 12, fontSize: 14 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: '#4ECDC4' },
  content: { padding: 12 },
  sectionTitle: { color: '#888', fontSize: 14, marginBottom: 12 },
  card: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  cardImageWrap: { position: 'relative' },
  cardImage: { width: '100%', height: 160 },
  cardOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26,26,46,0.3)', justifyContent: 'center', alignItems: 'center' },
  cardBody: { padding: 14 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cardDesc: { color: '#aaa', fontSize: 13, marginTop: 4 },
  cardFooter: { marginTop: 10 },
  boneBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  boneCount: { color: '#4ECDC4', fontSize: 13, marginLeft: 6 },
  btnRow: { flexDirection: 'row' },
  studyBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#4ECDC4', marginRight: 8 },
  studyText: { color: '#4ECDC4', fontWeight: '600', marginLeft: 6, fontSize: 13 },
  examBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#4ECDC4' },
  examText: { color: '#fff', fontWeight: '600', marginRight: 6, fontSize: 13 },
});
