import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getDivisions } from '../data';

export default function DivisionsScreen() {
  const router = useRouter();
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const divisions = getDivisions(animalId as string);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Caballo</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {divisions.map((d) => {
          const color = d.id === 'axial' ? '#4ECDC4' : '#FF6B6B';
          return (
            <TouchableOpacity key={d.id} style={[s.card, { borderLeftColor: color }]} onPress={() => router.push(`/subdivisions/${animalId}/${d.id}`)}>
              <Ionicons name={(d.id === 'axial' ? 'body' : 'walk') as any} size={32} color={color} />
              <View style={s.cardBody}>
                <Text style={s.cardTitle}>{d.name}</Text>
                <Text style={s.cardDesc}>{d.desc}</Text>
                <Text style={[s.cardBones, { color }]}>{d.bones} huesos</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#555" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const TOP = Platform.OS === 'android' ? 30 : 0;
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: TOP },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#fff' },
  content: { padding: 12, paddingBottom: 40 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 10, borderLeftWidth: 4 },
  cardBody: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  cardDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  cardBones: { fontSize: 13, fontWeight: '500', marginTop: 4 },
});
