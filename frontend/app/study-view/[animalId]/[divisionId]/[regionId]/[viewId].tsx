import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getLocalImage } from '../../../../localImages';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Bone { id: string; name: string; qty: number; desc: string; x: number; y: number; color: string; }
interface StudyData { region: string; view: string; desc: string; image: string; bones: Bone[]; }

const COLORS: { [k: string]: string } = { 'Rojo': '#FF3333', 'Azul': '#3366FF', 'Verde': '#33CC33', 'Amarillo': '#FFCC00', 'Naranja': '#FF6600', 'Morado': '#9933FF' };

export default function StudyViewScreen() {
  const router = useRouter();
  const { animalId, divisionId, regionId, viewId } = useLocalSearchParams<{
    animalId: string; divisionId: string; regionId: string; viewId: string;
  }>();
  const [data, setData] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBone, setSelectedBone] = useState<Bone | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/study-view/${animalId}/${divisionId}/${regionId}/${viewId}`);
      const json = await res.json();
      if (json.image?.startsWith('/')) json.image = `${BACKEND_URL}${json.image}`;
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <SafeAreaView style={s.center}><ActivityIndicator size="large" color="#4ECDC4" /><Text style={s.loadingText}>Cargando...</Text></SafeAreaView>;
  if (!data) return <SafeAreaView style={s.center}><Text style={s.errorText}>Error al cargar</Text></SafeAreaView>;

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity style={s.closeBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>{data.view}</Text>
          <Text style={s.headerSub}>{data.region} · Modo Estudio</Text>
        </View>
        <TouchableOpacity style={[s.toggleBtn, showLabels && s.toggleActive]} onPress={() => setShowLabels(!showLabels)}>
          <Ionicons name={showLabels ? 'eye' : 'eye-off'} size={20} color={showLabels ? '#1a1a2e' : '#888'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <View style={s.infoBar}>
          <Ionicons name="book-outline" size={18} color="#4ECDC4" />
          <Text style={s.infoText}>Toca un marcador para ver detalles</Text>
        </View>

        <View style={s.imageCard}>
          <View style={s.imageWrapper}>
            <Image source={getLocalImage(regionId as string, viewId as string) || { uri: data.image }} style={s.anatomyImage} contentFit="contain" />
            {data.bones.map((bone) => {
              const color = COLORS[bone.color] || '#FF3333';
              return (
                <TouchableOpacity key={bone.id} style={[s.marker, { left: `${bone.x}%`, top: `${bone.y}%`, borderColor: color, backgroundColor: selectedBone?.id === bone.id ? `${color}60` : `${color}30` }]} onPress={() => setSelectedBone(selectedBone?.id === bone.id ? null : bone)}>
                  <View style={[s.markerCore, { backgroundColor: color }]} />
                </TouchableOpacity>
              );
            })}
            {showLabels && data.bones.map((bone) => {
              const color = COLORS[bone.color] || '#FF3333';
              const left = bone.x > 60;
              return (
                <View key={`l-${bone.id}`} style={[s.label, { left: left ? undefined : `${bone.x + 4}%`, right: left ? `${100 - bone.x + 4}%` : undefined, top: `${bone.y - 1}%` }]}>
                  <Text style={[s.labelText, { color }]} numberOfLines={1}>{bone.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {selectedBone && (
          <View style={[s.detailCard, { borderLeftColor: COLORS[selectedBone.color] || '#FF3333' }]}>
            <View style={s.detailHeader}>
              <View style={[s.detailDot, { backgroundColor: COLORS[selectedBone.color] || '#FF3333' }]} />
              <Text style={s.detailName}>{selectedBone.name}</Text>
              {selectedBone.qty > 1 && <View style={s.qtyBadge}><Text style={s.qtyText}>×{selectedBone.qty}</Text></View>}
            </View>
            <Text style={s.detailDesc}>{selectedBone.desc}</Text>
          </View>
        )}

        <Text style={s.listTitle}>Estructuras en esta vista ({data.bones.length})</Text>
        {data.bones.map((bone) => {
          const color = COLORS[bone.color] || '#FF3333';
          const sel = selectedBone?.id === bone.id;
          return (
            <TouchableOpacity key={bone.id} style={[s.boneItem, sel && { borderColor: color, backgroundColor: `${color}10` }]} onPress={() => setSelectedBone(sel ? null : bone)}>
              <View style={[s.boneDot, { backgroundColor: color }]} />
              <View style={s.boneInfo}>
                <Text style={[s.boneName, sel && { color }]}>{bone.name}</Text>
                <Text style={s.boneDesc} numberOfLines={1}>{bone.desc}</Text>
              </View>
              {bone.qty > 1 && <Text style={s.boneQty}>×{bone.qty}</Text>}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={s.examBtn} onPress={() => router.replace(`/exam-view/${animalId}/${divisionId}/${regionId}/${viewId}`)}>
          <Ionicons name="school-outline" size={20} color="#fff" />
          <Text style={s.examBtnText}>Ir al Examen de esta Vista</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 16 }, errorText: { color: '#FF6B6B', fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 11, color: '#4ECDC4' },
  toggleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  toggleActive: { backgroundColor: '#4ECDC4' },
  content: { padding: 12 },
  infoBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(78,205,196,0.1)', padding: 12, borderRadius: 10, marginBottom: 12 },
  infoText: { color: '#4ECDC4', fontSize: 13, marginLeft: 8 },
  imageCard: { backgroundColor: '#0f1629', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  imageWrapper: { position: 'relative', backgroundColor: '#fff' },
  anatomyImage: { width: '100%', height: 340 },
  marker: { position: 'absolute', width: 36, height: 36, borderRadius: 18, borderWidth: 3, marginLeft: -18, marginTop: -18, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  markerCore: { width: 12, height: 12, borderRadius: 6 },
  label: { position: 'absolute', zIndex: 5, paddingHorizontal: 4, paddingVertical: 1, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 3 },
  labelText: { fontSize: 9, fontWeight: '700' },
  detailCard: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailDot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  detailName: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1 },
  qtyBadge: { backgroundColor: 'rgba(255,234,167,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  qtyText: { color: '#FFEAA7', fontWeight: '700', fontSize: 13 },
  detailDesc: { color: '#ccc', fontSize: 14, lineHeight: 22 },
  listTitle: { color: '#888', fontSize: 14, marginBottom: 10, marginTop: 4 },
  boneItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 2, borderColor: '#2a2a4a' },
  boneDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  boneInfo: { flex: 1 }, boneName: { color: '#fff', fontSize: 15, fontWeight: '500' },
  boneDesc: { color: '#888', fontSize: 12, marginTop: 2 },
  boneQty: { color: '#FFEAA7', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  examBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4ECDC4', borderRadius: 12, padding: 16, marginTop: 8, marginBottom: 20 },
  examBtnText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
