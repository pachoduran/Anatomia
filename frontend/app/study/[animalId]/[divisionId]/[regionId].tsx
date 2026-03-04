import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRegion, Bone } from '../../../data';
import { getLocalImage } from '../../../localImages';
import { SafeScreen } from '../../../SafeScreen';
import { useOrientation } from '../../../useOrientation';
import { ZoomableImage } from '../../../ZoomableImage';

const COLORS: Record<string, string> = { Rojo: '#FF3333', Azul: '#3366FF', Verde: '#33CC33', Amarillo: '#FFCC00', Naranja: '#FF6600', Morado: '#9933FF' };

export default function StudyScreen() {
  const router = useRouter();
  const { animalId, divisionId, regionId } = useLocalSearchParams<{ animalId: string; divisionId: string; regionId: string }>();
  const region = getRegion(animalId!, divisionId!, regionId!);
  const [selected, setSelected] = useState<Bone | null>(null);
  const { isLandscape, height } = useOrientation();

  if (!region) return <View style={s.center}><Text style={s.err}>No encontrado</Text></View>;

  const imgHeight = isLandscape ? height - 80 : 280;

  const imageSection = (
    <View style={[s.imgCard, isLandscape && { flex: 2, marginBottom: 0, marginRight: 6 }]}>
      <ZoomableImage source={getLocalImage(region.imageKey)} style={{ height: imgHeight }}>
        {region.questions.map(b => {
          const c = COLORS[b.color] || '#FF3333';
          const sel = selected?.id === b.id;
          return (
            <Pressable
              key={b.id}
              data-testid={`marker-${b.id}`}
              style={[sel ? s.markerBig : s.markerSmall, { left: `${b.x}%`, top: `${b.y}%`, backgroundColor: c }]}
              onPress={() => setSelected(sel ? null : b)}
              hitSlop={12}
            />
          );
        })}
      </ZoomableImage>
    </View>
  );

  const listSection = (
    <ScrollView style={isLandscape ? { flex: 1 } : undefined} contentContainerStyle={isLandscape ? { paddingBottom: 10 } : undefined}>
      {selected && (
        <View style={[s.detail, { borderLeftColor: COLORS[selected.color] || '#FF3333' }]}>
          <View style={s.detailRow}><View style={[s.detailDot, { backgroundColor: COLORS[selected.color] }]} /><Text style={[s.detailName, isLandscape && { fontSize: 13 }]}>{selected.name}</Text>{selected.qty > 1 && <Text style={s.qty}>x{selected.qty}</Text>}</View>
          <Text style={[s.detailDesc, isLandscape && { fontSize: 11 }]}>{selected.desc}</Text>
        </View>
      )}
      <Text style={[s.listTitle, isLandscape && { fontSize: 11 }]}>Huesos ({region.questions.length})</Text>
      {region.questions.map(b => {
        const c = COLORS[b.color] || '#FF3333'; const sel = selected?.id === b.id;
        return (
          <TouchableOpacity key={b.id} style={[s.bone, sel && { borderColor: c, backgroundColor: `${c}10` }, isLandscape && { padding: 6, marginBottom: 3 }]} onPress={() => setSelected(sel ? null : b)}>
            <View style={[s.boneDot, { backgroundColor: c }, isLandscape && { width: 6, height: 6, borderRadius: 3 }]} />
            <View style={s.boneInfo}><Text style={[s.boneName, sel && { color: c }, isLandscape && { fontSize: 12 }]}>{b.name}</Text>{!isLandscape && <Text style={s.boneDesc} numberOfLines={1}>{b.desc}</Text>}</View>
            {b.qty > 1 && <Text style={[s.boneQty, isLandscape && { fontSize: 11 }]}>x{b.qty}</Text>}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={[s.examBtn, isLandscape && { padding: 10 }]} onPress={() => router.replace(`/exam-new/${animalId}/${divisionId}/${regionId}`)}>
        <Ionicons name="school-outline" size={isLandscape ? 14 : 18} color="#fff" /><Text style={[s.examTxt, isLandscape && { fontSize: 12 }]}>Examen</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeScreen>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color="#fff" /></TouchableOpacity>
        <View style={s.hCenter}><Text style={s.hTitle}>{region.name}</Text><Text style={s.hSub}>Modo Estudio</Text></View>
        <View style={{ width: 36 }} />
      </View>
      {isLandscape ? (
        <View style={s.landscapeRow}>{imageSection}{listSection}</View>
      ) : (
        <ScrollView contentContainerStyle={s.scroll}>
          {imageSection}
          {selected && (
            <View style={[s.detail, { borderLeftColor: COLORS[selected.color] || '#FF3333' }]}>
              <View style={s.detailRow}><View style={[s.detailDot, { backgroundColor: COLORS[selected.color] }]} /><Text style={s.detailName}>{selected.name}</Text>{selected.qty > 1 && <Text style={s.qty}>x{selected.qty}</Text>}</View>
              <Text style={s.detailDesc}>{selected.desc}</Text>
            </View>
          )}
          <Text style={s.listTitle}>Huesos ({region.questions.length})</Text>
          {region.questions.map(b => {
            const c = COLORS[b.color] || '#FF3333'; const sel = selected?.id === b.id;
            return (
              <TouchableOpacity key={b.id} style={[s.bone, sel && { borderColor: c, backgroundColor: `${c}10` }]} onPress={() => setSelected(sel ? null : b)}>
                <View style={[s.boneDot, { backgroundColor: c }]} />
                <View style={s.boneInfo}><Text style={[s.boneName, sel && { color: c }]}>{b.name}</Text><Text style={s.boneDesc} numberOfLines={1}>{b.desc}</Text></View>
                {b.qty > 1 && <Text style={s.boneQty}>x{b.qty}</Text>}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={s.examBtn} onPress={() => router.replace(`/exam-new/${animalId}/${divisionId}/${regionId}`)}>
            <Ionicons name="school-outline" size={18} color="#fff" /><Text style={s.examTxt}>Examen</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  err: { color: '#FF6B6B' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  hCenter: { flex: 1, alignItems: 'center' }, hTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' }, hSub: { fontSize: 10, color: '#4ECDC4' },
  scroll: { padding: 10, paddingBottom: 40 },
  landscapeRow: { flex: 1, flexDirection: 'row', padding: 6 },
  imgCard: { backgroundColor: '#0f1629', borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  marker: { position: 'absolute', width: 14, height: 14, borderRadius: 7, marginLeft: -7, marginTop: -7, zIndex: 10, borderWidth: 2, borderColor: '#fff' },
  markerSmall: { position: 'absolute', width: 8, height: 8, borderRadius: 4, marginLeft: -4, marginTop: -4, zIndex: 10, opacity: 0.6 },
  markerBig: { position: 'absolute', width: 16, height: 16, borderRadius: 8, marginLeft: -8, marginTop: -8, zIndex: 10, borderWidth: 2, borderColor: '#fff' },
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
