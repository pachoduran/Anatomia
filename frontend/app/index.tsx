import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ANIMALS } from './data';
import { getLocalImage } from './localImages';

export default function HomeScreen() {
  const router = useRouter();
  const horse = ANIMALS[0];

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.title}>VetBones</Text>
        <Text style={s.subtitle}>Sistema Óseo Veterinario</Text>

        <View style={s.statsRow}>
          <View style={s.stat}><Text style={s.statNum}>{horse.totalBones}</Text><Text style={s.statLabel}>Huesos</Text></View>
          <View style={s.stat}><Text style={s.statNum}>{horse.divisions.length}</Text><Text style={s.statLabel}>Divisiones</Text></View>
          <View style={s.stat}><Text style={s.statNum}>5</Text><Text style={s.statLabel}>Regiones</Text></View>
        </View>

        <TouchableOpacity style={s.card} onPress={() => router.push(`/divisions/${horse.id}`)}>
          <Image source={getLocalImage('craneo')} style={s.cardImg} contentFit="cover" />
          <View style={s.cardOverlay}>
            <Ionicons name="paw" size={28} color="#fff" />
          </View>
          <View style={s.cardBody}>
            <Text style={s.cardTitle}>{horse.name}</Text>
            <Text style={s.cardSci}>{horse.nameScientific}</Text>
            <Text style={s.cardBones}>{horse.totalBones} huesos</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const TOP = Platform.OS === 'android' ? 30 : 0;
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: TOP },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#4ECDC4', textAlign: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#4ECDC4' },
  statLabel: { fontSize: 12, color: '#888' },
  card: { backgroundColor: '#16213e', borderRadius: 12, overflow: 'hidden' },
  cardImg: { width: '100%', height: 140 },
  cardOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 140, backgroundColor: 'rgba(26,26,46,0.4)', justifyContent: 'center', alignItems: 'center' },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  cardSci: { fontSize: 13, color: '#888', fontStyle: 'italic', marginTop: 2 },
  cardBones: { fontSize: 14, color: '#4ECDC4', marginTop: 6 },
});
