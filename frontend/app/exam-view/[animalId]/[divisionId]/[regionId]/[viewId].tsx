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
  Alert,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getLocalImage } from '../../../../localImages';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width } = Dimensions.get('window');

interface Question {
  id: string;
  bone_id: string;
  name: string;
  qty: number;
  desc: string;
  x: number;
  y: number;
  color: string;
  options: string[];
  answer: string;
}

interface Exam {
  id: string;
  region: string;
  image: string;
  zoom: string;
  total: number;
  questions: Question[];
}

const COLORS: { [key: string]: string } = {
  'Rojo': '#FF3333',
  'Azul': '#3366FF',
  'Verde': '#33CC33',
  'Amarillo': '#FFCC00',
  'Naranja': '#FF6600',
  'Morado': '#9933FF',
};

export default function ExamScreen() {
  const router = useRouter();
  const { animalId, divisionId, regionId, viewId } = useLocalSearchParams<{
    animalId: string;
    divisionId: string;
    regionId: string;
    viewId: string;
  }>();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    loadExam();
  }, []);

  const loadExam = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/exam-view/${animalId}/${divisionId}/${regionId}/${viewId}?num=5`);
      const data = await res.json();
      if (data.image?.startsWith('/')) data.image = `${BACKEND_URL}${data.image}`;
      setExam(data);
      setIdx(0);
      setSelected(null);
      setConfirmed(false);
      setScore(0);
      setDone(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (opt: string) => {
    if (!confirmed) setSelected(opt);
  };

  const handleConfirm = () => {
    if (!selected || !exam) return;
    if (selected === exam.questions[idx].answer) {
      setScore(s => s + 1);
    }
    setConfirmed(true);
  };

  const handleNext = () => {
    if (!exam) return;
    if (idx < exam.questions.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setDone(true);
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

  if (!exam) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>Error al cargar</Text>
        <TouchableOpacity style={styles.btn} onPress={loadExam}>
          <Text style={styles.btnText}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Pantalla de resultados
  if (done) {
    const pct = Math.round((score / exam.total) * 100);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsContent}>
          <View style={styles.resultsCard}>
            <View style={[styles.scoreCircle, { borderColor: pct >= 60 ? '#4ECDC4' : '#FF6B6B' }]}>
              <Text style={[styles.scorePct, { color: pct >= 60 ? '#4ECDC4' : '#FF6B6B' }]}>{pct}%</Text>
            </View>
            <Text style={styles.resultsTitle}>
              {pct >= 80 ? '¡Excelente!' : pct >= 60 ? '¡Bien!' : 'Sigue practicando'}
            </Text>
            <Text style={styles.resultsRegion}>{exam.region}</Text>
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Ionicons name="checkmark-circle" size={28} color="#4ECDC4" />
                <Text style={styles.scoreNum}>{score}</Text>
                <Text style={styles.scoreLabel}>Correctas</Text>
              </View>
              <View style={styles.scoreItem}>
                <Ionicons name="close-circle" size={28} color="#FF6B6B" />
                <Text style={styles.scoreNum}>{exam.total - score}</Text>
                <Text style={styles.scoreLabel}>Incorrectas</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.restartBtn} onPress={loadExam}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.restartText}>Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const q = exam.questions[idx];
  const color = COLORS[q.color] || '#FF3333';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => {
          Alert.alert('Salir', '¿Deseas salir?', [
            { text: 'No', style: 'cancel' },
            { text: 'Sí', onPress: () => router.back() }
          ]);
        }}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.progress}>
          <Text style={styles.progressText}>{idx + 1}/{exam.total}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((idx + 1) / exam.total) * 100}%` }]} />
          </View>
        </View>
        <View style={styles.scoreBox}>
          <Ionicons name="star" size={16} color="#FFEAA7" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Instrucción con color */}
        <View style={[styles.colorBar, { backgroundColor: `${color}20`, borderLeftColor: color }]}>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
          <Text style={styles.colorInstruction}>
            Identifica el hueso marcado en <Text style={[styles.colorName, { color }]}>{q.color}</Text>
          </Text>
        </View>

        {/* Imagen con marcador */}
        <View style={styles.imageCard}>
          <View style={styles.regionLabel}>
            <Ionicons name="location" size={16} color="#4ECDC4" />
            <Text style={styles.regionText}>{exam.region}</Text>
          </View>
          
          <View style={styles.imageWrapper}>
            <Image
              source={getLocalImage(regionId as string, viewId as string) || { uri: exam.image }}
              style={styles.skeletonImage}
              contentFit="contain"
            />
            {/* Marcador grande y visible */}
            <View style={[
              styles.marker,
              { left: `${q.x}%`, top: `${q.y}%`, borderColor: color }
            ]}>
              <View style={[styles.markerPulse, { backgroundColor: `${color}40` }]} />
              <View style={[styles.markerCore, { backgroundColor: color }]} />
            </View>
            {/* Línea de conexión */}
            <View style={[styles.markerLine, { left: `${q.x}%`, top: `${q.y}%`, backgroundColor: color }]} />
          </View>

          {/* Descripción */}
          <View style={[styles.descBox, { borderTopColor: color }]}>
            <Text style={styles.descTitle}>Pista:</Text>
            <Text style={styles.descText}>{q.desc}</Text>
            {q.qty > 1 && <Text style={styles.qtyText}>Cantidad: {q.qty}</Text>}
          </View>
        </View>

        {/* Opciones */}
        <Text style={styles.optionsTitle}>¿Qué hueso es?</Text>
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === q.answer;
          
          let style = styles.option;
          let textStyle = styles.optionText;
          
          if (confirmed) {
            if (isCorrect) {
              style = styles.optionCorrect;
              textStyle = styles.optionTextCorrect;
            } else if (isSelected) {
              style = styles.optionWrong;
              textStyle = styles.optionTextWrong;
            }
          } else if (isSelected) {
            style = styles.optionSelected;
            textStyle = styles.optionTextSelected;
          }

          return (
            <TouchableOpacity
              key={i}
              style={style}
              onPress={() => handleSelect(opt)}
              disabled={confirmed}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.letterText}>{String.fromCharCode(65 + i)}</Text>
              </View>
              <Text style={textStyle}>{opt}</Text>
              {confirmed && isCorrect && <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />}
              {confirmed && isSelected && !isCorrect && <Ionicons name="close-circle" size={24} color="#FF6B6B" />}
            </TouchableOpacity>
          );
        })}

        {/* Botón de acción */}
        {!confirmed ? (
          <TouchableOpacity
            style={[styles.actionBtn, !selected && styles.actionBtnDisabled]}
            onPress={handleConfirm}
            disabled={!selected}
          >
            <Text style={styles.actionText}>Confirmar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.actionText}>{idx < exam.questions.length - 1 ? 'Siguiente' : 'Ver Resultados'}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 16, fontSize: 16 },
  errorText: { color: '#FF6B6B', marginTop: 16, fontSize: 16 },
  btn: { backgroundColor: '#4ECDC4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 },
  btnText: { color: '#fff', fontWeight: '600' },

  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  progress: { flex: 1, marginHorizontal: 12 },
  progressText: { color: '#888', fontSize: 12, textAlign: 'center', marginBottom: 4 },
  progressBar: { height: 6, backgroundColor: '#2a2a4a', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#4ECDC4', borderRadius: 3 },
  scoreBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  scoreText: { color: '#FFEAA7', fontWeight: 'bold', marginLeft: 4, fontSize: 16 },

  content: { padding: 12 },

  colorBar: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 10, marginBottom: 12, borderLeftWidth: 4 },
  colorDot: { width: 20, height: 20, borderRadius: 10, marginRight: 12 },
  colorInstruction: { color: '#fff', fontSize: 15, flex: 1 },
  colorName: { fontWeight: 'bold', fontSize: 16 },

  imageCard: { backgroundColor: '#0f1629', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  regionLabel: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#16213e' },
  regionText: { color: '#4ECDC4', marginLeft: 8, fontWeight: '600', fontSize: 14 },
  
  imageWrapper: { position: 'relative', backgroundColor: '#fff' },
  skeletonImage: { width: '100%', height: 300 },
  
  marker: { position: 'absolute', width: 50, height: 50, borderRadius: 25, borderWidth: 4, marginLeft: -25, marginTop: -25, justifyContent: 'center', alignItems: 'center' },
  markerPulse: { position: 'absolute', width: 50, height: 50, borderRadius: 25 },
  markerCore: { width: 16, height: 16, borderRadius: 8 },
  markerLine: { position: 'absolute', width: 3, height: 40, marginLeft: -1.5 },

  descBox: { padding: 12, backgroundColor: '#16213e', borderTopWidth: 3 },
  descTitle: { color: '#4ECDC4', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  descText: { color: '#ccc', fontSize: 14, lineHeight: 20 },
  qtyText: { color: '#FFEAA7', fontSize: 13, marginTop: 6 },

  optionsTitle: { color: '#888', fontSize: 14, marginBottom: 10 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 2, borderColor: '#2a2a4a' },
  optionSelected: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 2, borderColor: '#4ECDC4' },
  optionCorrect: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(78, 205, 196, 0.15)', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 2, borderColor: '#4ECDC4' },
  optionWrong: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 107, 107, 0.15)', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 2, borderColor: '#FF6B6B' },
  optionLetter: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#2a2a4a', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  letterText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  optionText: { flex: 1, color: '#fff', fontSize: 15 },
  optionTextSelected: { flex: 1, color: '#4ECDC4', fontSize: 15, fontWeight: '500' },
  optionTextCorrect: { flex: 1, color: '#4ECDC4', fontSize: 15, fontWeight: '600' },
  optionTextWrong: { flex: 1, color: '#FF6B6B', fontSize: 15, fontWeight: '500' },

  actionBtn: { backgroundColor: '#4ECDC4', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  actionBtnDisabled: { backgroundColor: '#2a2a4a' },
  nextBtn: { backgroundColor: '#45B7D1', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 },

  resultsContent: { padding: 20, alignItems: 'center' },
  resultsCard: { backgroundColor: '#16213e', borderRadius: 20, padding: 30, alignItems: 'center', width: '100%', marginBottom: 20 },
  scoreCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  scorePct: { fontSize: 40, fontWeight: 'bold' },
  resultsTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  resultsRegion: { fontSize: 14, color: '#888', marginBottom: 20 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  scoreItem: { alignItems: 'center' },
  scoreNum: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  scoreLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  restartBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4ECDC4', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12, marginBottom: 12 },
  restartText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  backBtn: { padding: 14 },
  backText: { color: '#888', fontSize: 14 },
});
