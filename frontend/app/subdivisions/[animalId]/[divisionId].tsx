import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRegions } from '../../data';
import { getLocalImage } from '../../localImages';
import { SafeScreen } from '../../SafeScreen';

export default function SubdivisionsScreen() {
  const router = useRouter();
  const { animalId, divisionId } = useLocalSearchParams<{ animalId: string; divisionId: string }>();
  const regions = getRegions(animalId as string, divisionId as string);
  const color = divisionId === 'axial' ? '#4ECDC4' : '#FF6B6B';

  const navigate = (regionId: string, hasViews: boolean) => {
    if (hasViews) router.push(`/views/${animalId}/${divisionId}/${regionId}`);
    else router.push(`/study/${animalId}/${divisionId}/${regionId}`);
  };

  return (
    <SafeScreen>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{divisionId === 'axial' ? 'Esqueleto Axial' : 'Esqueleto Apendicular'}</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {regions.map((r) => (
          <View key={r.id} style={s.card}>
            <TouchableOpacity onPress={() => navigate(r.id, !!r.views)}>
              <Image source={getLocalImage(r.imageKey)} style={s.cardImg} contentFit="cover" />
              <View style={[s.cardOverlay, { backgroundColor: `${color}30` }]}>
                <Ionicons name="search" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={s.cardBody}>
              <Text style={s.cardTitle}>{r.name}</Text>
              <Text style={s.cardDesc}>{r.desc}</Text>
              {r.views && (
                <View style={s.viewsBadge}>
                  <Ionicons name="layers-outline" size={13} color="#FFEAA7" />
                  <Text style={s.viewsText}>{r.views.length} vistas</Text>
                </View>
              )}
              <View style={s.row}>
                <Text style={[s.boneCount, { color }]}>{r.bones} huesos</Text>
                <View style={s.btnRow}>
                  <TouchableOpacity style={[s.studyBtn, { borderColor: color }]} onPress={() => navigate(r.id, !!r.views)}>
                    <Ionicons name="book-outline" size={14} color={color} />
                    <Text style={[s.studyTxt, { color }]}>{r.views ? 'Vistas' : 'Estudiar'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.examBtn, { backgroundColor: color }]} onPress={() => {
                    if (r.views) router.push(`/views/${animalId}/${divisionId}/${r.id}`);
                    else router.push(`/exam-new/${animalId}/${divisionId}/${r.id}`);
                  }}>
                    <Text style={s.examTxt}>{r.views ? 'Explorar' : 'Examen'}</Text>
                    <Ionicons name="play" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#fff' },
  content: { padding: 10, paddingBottom: 40 },
  card: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  cardImg: { width: '100%', height: 130 },
  cardOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 130, justifyContent: 'center', alignItems: 'center' },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  cardDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  viewsBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: 'rgba(255,234,167,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  viewsText: { color: '#FFEAA7', fontSize: 11, fontWeight: '500', marginLeft: 4 },
  row: { marginTop: 8 },
  boneCount: { fontSize: 13, fontWeight: '500', marginBottom: 8 },
  btnRow: { flexDirection: 'row' },
  studyBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 2, marginRight: 8 },
  studyTxt: { fontWeight: '600', marginLeft: 4, fontSize: 13 },
  examBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  examTxt: { color: '#fff', fontWeight: '600', marginRight: 4, fontSize: 13 },
});
