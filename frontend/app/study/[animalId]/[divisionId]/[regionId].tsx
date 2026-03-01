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
  Dimensions,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width } = Dimensions.get('window');

interface Bone {
  id: string;
  name: string;
  qty: number;
  desc: string;
  x: number;
  y: number;
  color: string;
}

interface StudyData {
  region: string;
  desc: string;
  image: string;
  bones: Bone[];
}

const COLORS: { [key: string]: string } = {
  'Rojo': '#FF3333',
  'Azul': '#3366FF',
  'Verde': '#33CC33',
  'Amarillo': '#FFCC00',
  'Naranja': '#FF6600',
  'Morado': '#9933FF',
};

export default function StudyScreen() {
  const router = useRouter();
  const { animalId, divisionId, regionId } = useLocalSearchParams<{
    animalId: string;
    divisionId: string;
    regionId: string;
  }>();

  const [data, setData] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBone, setSelectedBone] = useState<Bone | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    loadStudy();
  }, []);

  const loadStudy = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/study/${animalId}/${divisionId}/${regionId}`);
      const json = await res.json();
      setData(json);
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
        <Text style={styles.loadingText}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Error al cargar</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadStudy}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{data.region}</Text>
          <Text style={styles.headerSub}>Modo Estudio</Text>
        </View>
        <TouchableOpacity
          style={[styles.toggleBtn, showLabels && styles.toggleActive]}
          onPress={() => setShowLabels(!showLabels)}
        >
          <Ionicons name={showLabels ? 'eye' : 'eye-off'} size={20} color={showLabels ? '#1a1a2e' : '#888'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info */}
        <View style={styles.infoBar}>
          <Ionicons name="book-outline" size={18} color="#4ECDC4" />
          <Text style={styles.infoText}>Toca un marcador para ver detalles del hueso</Text>
        </View>

        {/* Imagen con todos los marcadores */}
        <View style={styles.imageCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: data.image }}
              style={styles.anatomyImage}
              contentFit="contain"
            />
            {data.bones.map((bone) => {
              const color = COLORS[bone.color] || '#FF3333';
              return (
                <TouchableOpacity
                  key={bone.id}
                  style={[
                    styles.marker,
                    {
                      left: `${bone.x}%`,
                      top: `${bone.y}%`,
                      borderColor: color,
                      backgroundColor: selectedBone?.id === bone.id ? `${color}60` : `${color}30`,
                    },
                  ]}
                  onPress={() => setSelectedBone(selectedBone?.id === bone.id ? null : bone)}
                  data-testid={`marker-${bone.id}`}
                >
                  <View style={[styles.markerCore, { backgroundColor: color }]} />
                </TouchableOpacity>
              );
            })}
            {/* Labels */}
            {showLabels && data.bones.map((bone) => {
              const color = COLORS[bone.color] || '#FF3333';
              const labelLeft = bone.x > 60;
              return (
                <View
                  key={`label-${bone.id}`}
                  style={[
                    styles.label,
                    {
                      left: labelLeft ? undefined : `${bone.x + 4}%`,
                      right: labelLeft ? `${100 - bone.x + 4}%` : undefined,
                      top: `${bone.y - 1}%`,
                    },
                  ]}
                >
                  <Text style={[styles.labelText, { color }]} numberOfLines={1}>{bone.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Detalle del hueso seleccionado */}
        {selectedBone && (
          <View style={[styles.detailCard, { borderLeftColor: COLORS[selectedBone.color] || '#FF3333' }]}>
            <View style={styles.detailHeader}>
              <View style={[styles.detailDot, { backgroundColor: COLORS[selectedBone.color] || '#FF3333' }]} />
              <Text style={styles.detailName}>{selectedBone.name}</Text>
              {selectedBone.qty > 1 && (
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyText}>×{selectedBone.qty}</Text>
                </View>
              )}
            </View>
            <Text style={styles.detailDesc}>{selectedBone.desc}</Text>
          </View>
        )}

        {/* Lista de todos los huesos */}
        <Text style={styles.listTitle}>Huesos de esta región ({data.bones.length})</Text>
        {data.bones.map((bone) => {
          const color = COLORS[bone.color] || '#FF3333';
          const isSelected = selectedBone?.id === bone.id;
          return (
            <TouchableOpacity
              key={bone.id}
              style={[styles.boneItem, isSelected && { borderColor: color, backgroundColor: `${color}10` }]}
              onPress={() => setSelectedBone(isSelected ? null : bone)}
              data-testid={`bone-${bone.id}`}
            >
              <View style={[styles.boneDot, { backgroundColor: color }]} />
              <View style={styles.boneInfo}>
                <Text style={[styles.boneName, isSelected && { color }]}>{bone.name}</Text>
                <Text style={styles.boneDesc} numberOfLines={1}>{bone.desc}</Text>
              </View>
              {bone.qty > 1 && <Text style={styles.boneQty}>×{bone.qty}</Text>}
            </TouchableOpacity>
          );
        })}

        {/* Botón ir al examen */}
        <TouchableOpacity
          style={styles.examBtn}
          onPress={() => router.replace(`/exam-new/${animalId}/${divisionId}/${regionId}`)}
          data-testid="go-to-exam-btn"
        >
          <Ionicons name="school-outline" size={20} color="#fff" />
          <Text style={styles.examBtnText}>Ir al Examen</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 16, fontSize: 16 },
  errorText: { color: '#FF6B6B', marginTop: 16, fontSize: 16 },
  retryBtn: { backgroundColor: '#4ECDC4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 },
  retryText: { color: '#fff', fontWeight: '600' },

  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: '#4ECDC4' },
  toggleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  toggleActive: { backgroundColor: '#4ECDC4' },

  content: { padding: 12 },

  infoBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(78,205,196,0.1)', padding: 12, borderRadius: 10, marginBottom: 12 },
  infoText: { color: '#4ECDC4', fontSize: 13, marginLeft: 8, flex: 1 },

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
  boneInfo: { flex: 1 },
  boneName: { color: '#fff', fontSize: 15, fontWeight: '500' },
  boneDesc: { color: '#888', fontSize: 12, marginTop: 2 },
  boneQty: { color: '#FFEAA7', fontWeight: '700', fontSize: 14, marginLeft: 8 },

  examBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4ECDC4', borderRadius: 12, padding: 16, marginTop: 8, marginBottom: 20 },
  examBtnText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
