import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getView, getRegion, Bone } from '../../../../data';
import { getLocalImage } from '../../../../localImages';
import { SafeScreen } from '../../../../SafeScreen';

const COLORS: Record<string, string> = { Rojo: '#FF3333', Azul: '#3366FF', Verde: '#33CC33', Amarillo: '#FFCC00', Naranja: '#FF6600', Morado: '#9933FF' };

export default function StudyViewScreen() {
  const router = useRouter();
  const { animalId, divisionId, regionId, viewId } = useLocalSearchParams<{ animalId: string; divisionId: string; regionId: string; viewId: string }>();
  const view = getView(animalId!, divisionId!, regionId!, viewId!);
  const region = getRegion(animalId!, divisionId!, regionId!);
  const [selected, setSelected] = useState<Bone | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  if (!view || !region) return <View style={s.center}><Text style={s.err}>No encontrado</Text></View>;

  return (
    <SafeScreen>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color="#fff" /></TouchableOpacity>
        <View style={s.hCenter}><Text style={s.hTitle}>{view.name}</Text><Text style={s.hSub}>{region.name} · Estudio</Text></View>
        <TouchableOpacity style={[s.toggle, showLabels && s.toggleOn]} onPress={() => setShowLabels(!showLabels)}>
          <Ionicons name={showLabels ? 'eye' : 'eye-off'} size={18} color={showLabels ? '#1a1a2e' : '#888'} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.imgCard}>
          <View style={s.imgWrap}>
            <Image source={getLocalImage(regionId!, viewId!)} style={s.img} contentFit="contain" />
            {view.questions.map(b => {
              const c = COLORS[b.color] || '#FF3333';
              return (
                <TouchableOpacity key={b.id} style={[s.marker, { left: `${b.x}%`, top: `${b.y}%`, borderColor: c, backgroundColor: selected?.id === b.id ? `${c}60` : `${c}30` }]} onPress={() => setSelected(selected?.id === b.id ? null : b)}>
                  <View style={[s.dot, { backgroundColor: c }]} />
                </TouchableOpacity>
              );
            })}
            {showLabels && view.questions.map(b => {
              const c = COLORS[b.color] || '#FF3333'; const l = b.x > 60;
              return <View key={`l${b.id}`} style={[s.label, { left: l ? undefined : `${b.x+4}%`, right: l ? `${100-b.x+4}%` : undefined, top: `${b.y-1}%` }]}><Text style={[s.labelTxt, { color: c }]} numberOfLines={1}>{b.name}</Text></View>;
            })}
          </View>
        </View>
        {selected && (
          <View style={[s.detail, { borderLeftColor: COLORS[selected.color] || '#FF3333' }]}>
            <View style={s.detailRow}><View style={[s.detailDot, { backgroundColor: COLORS[selected.color] }]} /><Text style={s.detailName}>{selected.name}</Text>{selected.qty > 1 && <Text style={s.qty}>×{selected.qty}</Text>}</View>
            <Text style={s.detailDesc}>{selected.desc}</Text>
          </View>
        )}
        <Text style={s.listTitle}>Estructuras ({view.questions.length})</Text>
        {view.questions.map(b => {
          const c = COLORS[b.color] || '#FF3333'; const sel = selected?.id === b.id;
          return (
            <TouchableOpacity key={b.id} style={[s.bone, sel && { borderColor: c, backgroundColor: `${c}10` }]} onPress={() => setSelected(sel ? null : b)}>
              <View style={[s.boneDot, { backgroundColor: c }]} />
              <View style={s.boneInfo}><Text style={[s.boneName, sel && { color: c }]}>{b.name}</Text><Text style={s.boneDesc} numberOfLines={1}>{b.desc}</Text></View>
              {b.qty > 1 && <Text style={s.boneQty}>×{b.qty}</Text>}
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={s.examBtn} onPress={() => router.replace(`/exam-view/${animalId}/${divisionId}/${regionId}/${viewId}`)}>
          <Ionicons name="school-outline" size={18} color="#fff" /><Text style={s.examTxt}>Examen de esta Vista</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  err: { color: '#FF6B6B' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  hCenter: { flex: 1, alignItems: 'center' }, hTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff' }, hSub: { fontSize: 10, color: '#4ECDC4' },
  toggle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  toggleOn: { backgroundColor: '#4ECDC4' },
  scroll: { padding: 10, paddingBottom: 40 },
  imgCard: { backgroundColor: '#0f1629', borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  imgWrap: { position: 'relative', backgroundColor: '#fff' },
  img: { width: '100%', height: 280 },
  marker: { position: 'absolute', width: 32, height: 32, borderRadius: 16, borderWidth: 3, marginLeft: -16, marginTop: -16, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { position: 'absolute', zIndex: 5, paddingHorizontal: 3, paddingVertical: 1, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 3 },
  labelTxt: { fontSize: 8, fontWeight: '700' },
  detail: { backgroundColor: '#16213e', borderRadius: 10, padding: 12, marginBottom: 10, borderLeftWidth: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  detailDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  detailName: { fontSize: 16, fontWeight: 'bold', color: '#fff', flex: 1 },
  qty: { color: '#FFEAA7', fontWeight: '700', fontSize: 13 },
  detailDesc: { color: '#ccc', fontSize: 13, lineHeight: 20 },
  listTitle: { color: '#888', fontSize: 13, marginBottom: 8 },
  bone: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 8, padding: 10, marginBottom: 6, borderWidth: 2, borderColor: '#2a2a4a' },
  boneDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  boneInfo: { flex: 1 }, boneName: { color: '#fff', fontSize: 14, fontWeight: '500' },
  boneDesc: { color: '#888', fontSize: 11, marginTop: 1 },
  boneQty: { color: '#FFEAA7', fontWeight: '700', fontSize: 13, marginLeft: 6 },
  examBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4ECDC4', borderRadius: 10, padding: 14, marginTop: 6, marginBottom: 16 },
  examTxt: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 6 },
});
