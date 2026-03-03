import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Bone, generateExam, getDivisionBoneNames } from './data';
import { getLocalImage } from './localImages';
import { useOrientation } from './useOrientation';

const COLORS: Record<string, string> = { Rojo: '#FF3333', Azul: '#3366FF', Verde: '#33CC33', Amarillo: '#FFCC00', Naranja: '#FF6600', Morado: '#9933FF' };

interface Props {
  title: string;
  subtitle: string;
  imageKey: string;
  viewKey?: string;
  questions: Bone[];
  divisionBoneNames: string[];
  backRoute?: string;
}

export function ExamComponent({ title, subtitle, imageKey, viewKey, questions, divisionBoneNames }: Props) {
  const router = useRouter();
  const { isLandscape, height } = useOrientation();
  const exam = useMemo(() => generateExam(questions, divisionBoneNames, 5), []);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (exam.length === 0) return <View style={s.center}><Text style={s.err}>Sin preguntas</Text></View>;

  const q = exam[idx];
  const c = COLORS[q.color] || '#FF3333';

  const confirm = () => { if (!chosen) return; setConfirmed(true); if (chosen === q.answer) setScore(s => s + 1); };
  const next = () => { if (idx + 1 >= exam.length) { setDone(true); return; } setIdx(i => i + 1); setChosen(null); setConfirmed(false); };

  if (done) {
    const pct = Math.round((score / exam.length) * 100);
    return (
      <View style={s.container}>
        <ScrollView contentContainerStyle={s.resultContent}>
          <View style={s.resultCard}>
            <Text style={s.resultIcon}>{pct >= 70 ? '🏆' : pct >= 40 ? '📖' : '💪'}</Text>
            <Text style={s.resultPct}>{pct}%</Text>
            <Text style={s.resultLabel}>{pct >= 70 ? 'Excelente!' : pct >= 40 ? 'Buen intento' : 'Sigue practicando'}</Text>
            <View style={s.resultRow}>
              <Text style={s.resultOk}>{score} correctas</Text>
              <Text style={s.resultBad}>{exam.length - score} incorrectas</Text>
            </View>
          </View>
          <TouchableOpacity style={s.retryBtn} onPress={() => { setIdx(0); setChosen(null); setConfirmed(false); setScore(0); setDone(false); }}>
            <Ionicons name="refresh" size={18} color="#fff" /><Text style={s.retryTxt}>Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backBtn2} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#4ECDC4" /><Text style={s.backTxt}>Volver</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const imgHeight = isLandscape ? height - 80 : 220;

  const imageSection = (
    <View style={[s.imgCard, isLandscape && { flex: 1, marginBottom: 0, marginRight: 8 }]}>
      <View style={s.imgWrap}>
        <Image source={getLocalImage(imageKey, viewKey)} style={[s.img, { height: imgHeight }]} contentFit="contain" />
        <View style={[s.marker, { left: `${q.x}%`, top: `${q.y}%`, borderColor: c }]}>
          <View style={[s.markerDot, { backgroundColor: c }]} />
        </View>
      </View>
    </View>
  );

  const controlsSection = (
    <ScrollView
      style={isLandscape ? { flex: 1 } : undefined}
      contentContainerStyle={isLandscape ? { paddingHorizontal: 4, paddingBottom: 10 } : undefined}
    >
      <View style={s.hint}>
        <View style={[s.hintDot, { backgroundColor: c }]} />
        <Text style={[s.hintTxt, isLandscape && { fontSize: 11 }]}>Hueso en <Text style={{ color: c, fontWeight: '700' }}>{q.color}</Text></Text>
      </View>
      <Text style={[s.desc, isLandscape && { fontSize: 10, marginBottom: 2 }]} numberOfLines={isLandscape ? 1 : undefined}>Pista: {q.desc}</Text>

      <View style={isLandscape ? { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' } : undefined}>
        {q.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSel = chosen === opt;
          const isCorrect = opt === q.answer;
          let bg = '#16213e'; let border = '#2a2a4a';
          if (confirmed && isCorrect) { bg = 'rgba(51,204,51,0.15)'; border = '#33CC33'; }
          else if (confirmed && isSel && !isCorrect) { bg = 'rgba(255,51,51,0.15)'; border = '#FF3333'; }
          else if (isSel) { bg = 'rgba(78,205,196,0.15)'; border = '#4ECDC4'; }
          return (
            <TouchableOpacity key={opt} disabled={confirmed} style={[s.option, { backgroundColor: bg, borderColor: border }, isLandscape && { width: '48%', padding: 8, marginBottom: 4 }]} onPress={() => setChosen(opt)}>
              <Text style={[s.optLetter, isSel && { color: '#4ECDC4' }, isLandscape && { fontSize: 12, width: 18 }]}>{letter}</Text>
              <Text style={[s.optText, isLandscape && { fontSize: 11 }]} numberOfLines={1}>{opt}</Text>
              {confirmed && isCorrect && <Ionicons name="checkmark-circle" size={isLandscape ? 16 : 20} color="#33CC33" />}
              {confirmed && isSel && !isCorrect && <Ionicons name="close-circle" size={isLandscape ? 16 : 20} color="#FF3333" />}
            </TouchableOpacity>
          );
        })}
      </View>

      {!confirmed ? (
        <TouchableOpacity style={[s.actionBtn, !chosen && s.actionDisabled, isLandscape && { padding: 10 }]} disabled={!chosen} onPress={confirm}>
          <Text style={[s.actionTxt, isLandscape && { fontSize: 13 }]}>Confirmar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[s.actionBtn, isLandscape && { padding: 10 }]} onPress={next}>
          <Text style={[s.actionTxt, isLandscape && { fontSize: 13 }]}>{idx + 1 >= exam.length ? 'Ver Resultado' : 'Siguiente'}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.hBack} onPress={() => router.back()}><Ionicons name="close" size={22} color="#fff" /></TouchableOpacity>
        <View style={s.hCenter}><Text style={s.hTitle}>{title}</Text><Text style={s.hSub}>{subtitle}</Text></View>
        <Text style={s.hCount}>{idx + 1}/{exam.length}</Text>
      </View>
      <View style={s.progress}><View style={[s.progressBar, { width: `${((idx + 1) / exam.length) * 100}%` }]} /></View>

      {isLandscape ? (
        <View style={s.landscapeRow}>
          {imageSection}
          {controlsSection}
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scroll}>
          {imageSection}
          <View style={s.hint}>
            <View style={[s.hintDot, { backgroundColor: c }]} />
            <Text style={s.hintTxt}>Identifica el hueso en <Text style={{ color: c, fontWeight: '700' }}>{q.color}</Text></Text>
          </View>
          <Text style={s.desc}>Pista: {q.desc}</Text>
          {q.qty > 1 && <Text style={s.qtyTxt}>Cantidad: {q.qty}</Text>}

          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSel = chosen === opt;
            const isCorrect = opt === q.answer;
            let bg = '#16213e'; let border = '#2a2a4a';
            if (confirmed && isCorrect) { bg = 'rgba(51,204,51,0.15)'; border = '#33CC33'; }
            else if (confirmed && isSel && !isCorrect) { bg = 'rgba(255,51,51,0.15)'; border = '#FF3333'; }
            else if (isSel) { bg = 'rgba(78,205,196,0.15)'; border = '#4ECDC4'; }
            return (
              <TouchableOpacity key={opt} disabled={confirmed} style={[s.option, { backgroundColor: bg, borderColor: border }]} onPress={() => setChosen(opt)}>
                <Text style={[s.optLetter, isSel && { color: '#4ECDC4' }]}>{letter}</Text>
                <Text style={s.optText}>{opt}</Text>
                {confirmed && isCorrect && <Ionicons name="checkmark-circle" size={20} color="#33CC33" />}
                {confirmed && isSel && !isCorrect && <Ionicons name="close-circle" size={20} color="#FF3333" />}
              </TouchableOpacity>
            );
          })}

          {!confirmed ? (
            <TouchableOpacity style={[s.actionBtn, !chosen && s.actionDisabled]} disabled={!chosen} onPress={confirm}>
              <Text style={s.actionTxt}>Confirmar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.actionBtn} onPress={next}>
              <Text style={s.actionTxt}>{idx + 1 >= exam.length ? 'Ver Resultado' : 'Siguiente'}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  err: { color: '#FF6B6B' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  hBack: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  hCenter: { flex: 1, alignItems: 'center' }, hTitle: { fontSize: 13, fontWeight: 'bold', color: '#fff' }, hSub: { fontSize: 10, color: '#4ECDC4' },
  hCount: { color: '#888', fontSize: 13, fontWeight: '600' },
  progress: { height: 3, backgroundColor: '#16213e' },
  progressBar: { height: 3, backgroundColor: '#4ECDC4' },
  scroll: { padding: 10, paddingBottom: 40 },
  landscapeRow: { flex: 1, flexDirection: 'row', padding: 6 },
  imgCard: { backgroundColor: '#0f1629', borderRadius: 10, overflow: 'hidden', marginBottom: 8 },
  imgWrap: { position: 'relative', backgroundColor: '#fff' },
  img: { width: '100%', height: 220 },
  marker: { position: 'absolute', width: 36, height: 36, borderRadius: 18, borderWidth: 4, marginLeft: -18, marginTop: -18, justifyContent: 'center', alignItems: 'center', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.2)' },
  markerDot: { width: 12, height: 12, borderRadius: 6 },
  hint: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  hintDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  hintTxt: { color: '#ccc', fontSize: 13 },
  desc: { color: '#888', fontSize: 12, marginBottom: 4 },
  qtyTxt: { color: '#FFEAA7', fontSize: 12, marginBottom: 6 },
  option: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 12, marginBottom: 6, borderWidth: 2 },
  optLetter: { color: '#555', fontWeight: '700', fontSize: 14, width: 24 },
  optText: { color: '#fff', fontSize: 14, flex: 1 },
  actionBtn: { backgroundColor: '#4ECDC4', borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  actionDisabled: { opacity: 0.4 },
  actionTxt: { color: '#fff', fontSize: 15, fontWeight: '600', marginRight: 6 },
  resultContent: { padding: 16, alignItems: 'center', justifyContent: 'center', flex: 1 },
  resultCard: { backgroundColor: '#16213e', borderRadius: 16, padding: 24, alignItems: 'center', width: '100%', marginBottom: 16 },
  resultIcon: { fontSize: 48, marginBottom: 8 },
  resultPct: { fontSize: 48, fontWeight: 'bold', color: '#4ECDC4' },
  resultLabel: { fontSize: 18, color: '#fff', fontWeight: '600', marginTop: 4 },
  resultRow: { flexDirection: 'row', marginTop: 16 },
  resultOk: { color: '#33CC33', fontSize: 14, marginRight: 16 },
  resultBad: { color: '#FF3333', fontSize: 14 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4ECDC4', borderRadius: 10, padding: 14, width: '100%', marginBottom: 10 },
  retryTxt: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 6 },
  backBtn2: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#4ECDC4', borderRadius: 10, padding: 14, width: '100%' },
  backTxt: { color: '#4ECDC4', fontSize: 15, fontWeight: '600', marginLeft: 6 },
});
