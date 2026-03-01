import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRegion } from '../../../data';
import { getLocalImage } from '../../../localImages';

const ICONS: Record<string, string> = { dorsal: 'arrow-up-circle', ventral: 'arrow-down-circle', lateral: 'arrow-forward-circle', caudal: 'arrow-back-circle', rostral: 'eye' };

export default function ViewsScreen() {
  const router = useRouter();
  const { animalId, divisionId, regionId } = useLocalSearchParams<{ animalId: string; divisionId: string; regionId: string }>();
  const region = getRegion(animalId as string, divisionId as string, regionId as string);

  if (!region?.views) return <View style={s.center}><Text style={s.err}>Sin vistas</Text></View>;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>{region.name}</Text>
          <Text style={s.headerSub}>{region.views.length} vistas anatómicas</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {region.views.map((v) => (
          <View key={v.id} style={s.card}>
            <TouchableOpacity onPress={() => router.push(`/study-view/${animalId}/${divisionId}/${regionId}/${v.id}`)}>
              <Image source={getLocalImage(regionId as string, v.id)} style={s.cardImg} contentFit="cover" />
              <View style={s.overlay}><Ionicons name={(ICONS[v.id] || 'eye') as any} size={28} color="#fff" /></View>
            </TouchableOpacity>
            <View style={s.cardBody}>
              <Text style={s.cardTitle}>{v.name}</Text>
              <Text style={s.cardDesc}>{v.desc}</Text>
              <View style={s.row}>
                <Text style={s.boneCount}>{v.questions.length} estructuras</Text>
                <View style={s.btnRow}>
                  <TouchableOpacity style={s.studyBtn} onPress={() => router.push(`/study-view/${animalId}/${divisionId}/${regionId}/${v.id}`)}>
                    <Ionicons name="book-outline" size={13} color="#4ECDC4" />
                    <Text style={s.studyTxt}>Estudiar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.examBtn} onPress={() => router.push(`/exam-view/${animalId}/${divisionId}/${regionId}/${v.id}`)}>
                    <Text style={s.examTxt}>Examen</Text>
                    <Ionicons name="play" size={13} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const TOP = Platform.OS === 'android' ? 30 : 0;
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: TOP },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  err: { color: '#FF6B6B', fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 11, color: '#4ECDC4' },
  content: { padding: 10, paddingBottom: 40 },
  card: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  cardImg: { width: '100%', height: 130 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 130, backgroundColor: 'rgba(26,26,46,0.3)', justifyContent: 'center', alignItems: 'center' },
  cardBody: { padding: 12 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cardDesc: { color: '#aaa', fontSize: 12, marginTop: 3 },
  row: { marginTop: 8 },
  boneCount: { color: '#4ECDC4', fontSize: 12, marginBottom: 8 },
  btnRow: { flexDirection: 'row' },
  studyBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, borderWidth: 2, borderColor: '#4ECDC4', marginRight: 8 },
  studyTxt: { color: '#4ECDC4', fontWeight: '600', marginLeft: 4, fontSize: 12 },
  examBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, backgroundColor: '#4ECDC4' },
  examTxt: { color: '#fff', fontWeight: '600', marginRight: 4, fontSize: 12 },
});
