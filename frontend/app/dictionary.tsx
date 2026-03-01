import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getLocalImage } from './localImages';
import { SafeScreen } from './SafeScreen';

interface Term {
  id: string;
  name: string;
  definition: string;
  example: string;
  color: string;
  icon: string;
}

const TERMS: Term[] = [
  { id: 'proximal', name: 'Proximal', definition: 'Lo que esta mas cerca del tronco o del punto de origen de una estructura.', example: 'El femur es proximal respecto a la tibia.', color: '#FF6B6B', icon: 'arrow-up' },
  { id: 'distal', name: 'Distal', definition: 'Lo que esta mas lejos del tronco o del punto de origen.', example: 'El casco es la estructura mas distal del miembro.', color: '#4ECDC4', icon: 'arrow-down' },
  { id: 'medial', name: 'Medial', definition: 'Hacia el plano medio (centro) del cuerpo del caballo.', example: 'La cara medial de la tibia mira hacia la otra pata.', color: '#FFEAA7', icon: 'arrow-back' },
  { id: 'lateral', name: 'Lateral', definition: 'Hacia afuera del cuerpo, alejandose del plano medio.', example: 'La cara lateral del miembro mira hacia afuera.', color: '#74B9FF', icon: 'arrow-forward' },
  { id: 'dorsal', name: 'Dorsal', definition: 'Hacia el lomo o la parte superior del cuerpo. En el miembro distal al carpo/tarso, es la superficie anterior.', example: 'La vista dorsal del craneo se observa desde arriba.', color: '#A29BFE', icon: 'chevron-up' },
  { id: 'ventral', name: 'Ventral', definition: 'Hacia el vientre o la parte inferior del cuerpo.', example: 'La vista ventral del craneo muestra la base.', color: '#FF7675', icon: 'chevron-down' },
  { id: 'craneal', name: 'Craneal', definition: 'Hacia la cabeza. En las extremidades proximales al carpo/tarso, indica la superficie anterior.', example: 'La superficie craneal del radio mira hacia adelante.', color: '#55EFC4', icon: 'arrow-up-circle' },
  { id: 'caudal', name: 'Caudal', definition: 'Hacia la cola. En las extremidades, indica la superficie posterior.', example: 'La superficie caudal del femur tiene la linea aspera.', color: '#FD79A8', icon: 'arrow-down-circle' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function GlossaryTab({ onSelectTerm }: { onSelectTerm: (t: Term) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ScrollView contentContainerStyle={st.scrollContent}>
      <View style={st.imgCard}>
        <Image source={getLocalImage('direcciones')} style={st.refImg} contentFit="contain" />
      </View>
      <Text style={st.sectionTitle}>Direcciones Anatomicas</Text>
      {TERMS.map(t => {
        const isOpen = expanded === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            data-testid={`term-${t.id}`}
            style={[st.termCard, isOpen && { borderColor: t.color }]}
            onPress={() => setExpanded(isOpen ? null : t.id)}
          >
            <View style={st.termHeader}>
              <View style={[st.termIcon, { backgroundColor: `${t.color}25` }]}>
                <Ionicons name={t.icon as any} size={18} color={t.color} />
              </View>
              <Text style={[st.termName, { color: t.color }]}>{t.name}</Text>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />
            </View>
            {isOpen && (
              <View style={st.termBody}>
                <Text style={st.termDef}>{t.definition}</Text>
                <View style={st.exampleBox}>
                  <Ionicons name="flask-outline" size={14} color="#4ECDC4" />
                  <Text style={st.exampleText}>{t.example}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

interface QuizQuestion {
  term: Term;
  options: string[];
  answer: string;
}

function QuizTab() {
  const quiz = useMemo(() => {
    const shuffled = shuffleArray(TERMS);
    return shuffled.map(term => {
      const others = TERMS.filter(t => t.id !== term.id).map(t => t.name);
      const distractors = shuffleArray(others).slice(0, 3);
      const options = shuffleArray([term.name, ...distractors]);
      return { term, options, answer: term.name } as QuizQuestion;
    });
  }, []);

  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const restart = () => {
    setIdx(0); setChosen(null); setConfirmed(false); setScore(0); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / quiz.length) * 100);
    return (
      <ScrollView contentContainerStyle={st.resultContent}>
        <View style={st.resultCard}>
          <Text style={st.resultEmoji}>{pct >= 75 ? '🏆' : pct >= 50 ? '📖' : '💪'}</Text>
          <Text style={st.resultPct}>{pct}%</Text>
          <Text style={st.resultLabel}>{pct >= 75 ? 'Excelente!' : pct >= 50 ? 'Buen intento' : 'Sigue practicando'}</Text>
          <View style={st.resultRow}>
            <Text style={st.resultOk}>{score} correctas</Text>
            <Text style={st.resultBad}>{quiz.length - score} incorrectas</Text>
          </View>
        </View>
        <TouchableOpacity data-testid="quiz-retry-btn" style={st.retryBtn} onPress={restart}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={st.retryTxt}>Repetir Quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const q = quiz[idx];

  const confirm = () => {
    if (!chosen) return;
    setConfirmed(true);
    if (chosen === q.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (idx + 1 >= quiz.length) { setDone(true); return; }
    setIdx(i => i + 1); setChosen(null); setConfirmed(false);
  };

  return (
    <ScrollView contentContainerStyle={st.scrollContent}>
      <View style={st.quizProgress}>
        <View style={[st.quizBar, { width: `${((idx + 1) / quiz.length) * 100}%` }]} />
      </View>
      <Text style={st.quizCounter}>{idx + 1} / {quiz.length}</Text>

      <View style={st.questionCard}>
        <Text style={st.questionLabel}>Cual es el termino correcto?</Text>
        <Text style={st.questionDef}>{q.term.definition}</Text>
        <View style={st.exampleBox}>
          <Ionicons name="flask-outline" size={14} color="#4ECDC4" />
          <Text style={st.exampleText}>{q.term.example}</Text>
        </View>
      </View>

      {q.options.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        const isSel = chosen === opt;
        const isCorrect = opt === q.answer;
        let bg = '#16213e'; let border = '#2a2a4a';
        if (confirmed && isCorrect) { bg = 'rgba(51,204,51,0.15)'; border = '#33CC33'; }
        else if (confirmed && isSel && !isCorrect) { bg = 'rgba(255,51,51,0.15)'; border = '#FF3333'; }
        else if (isSel) { bg = 'rgba(78,205,196,0.15)'; border = '#4ECDC4'; }
        return (
          <TouchableOpacity
            key={opt}
            data-testid={`quiz-option-${i}`}
            disabled={confirmed}
            style={[st.option, { backgroundColor: bg, borderColor: border }]}
            onPress={() => setChosen(opt)}
          >
            <Text style={[st.optLetter, isSel && { color: '#4ECDC4' }]}>{letter}</Text>
            <Text style={st.optText}>{opt}</Text>
            {confirmed && isCorrect && <Ionicons name="checkmark-circle" size={20} color="#33CC33" />}
            {confirmed && isSel && !isCorrect && <Ionicons name="close-circle" size={20} color="#FF3333" />}
          </TouchableOpacity>
        );
      })}

      {!confirmed ? (
        <TouchableOpacity
          data-testid="quiz-confirm-btn"
          style={[st.actionBtn, !chosen && st.actionDisabled]}
          disabled={!chosen}
          onPress={confirm}
        >
          <Text style={st.actionTxt}>Confirmar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity data-testid="quiz-next-btn" style={st.actionBtn} onPress={next}>
          <Text style={st.actionTxt}>{idx + 1 >= quiz.length ? 'Ver Resultado' : 'Siguiente'}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

export default function DictionaryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'glossary' | 'quiz'>('glossary');

  return (
    <SafeScreen>
      <View style={st.header}>
        <TouchableOpacity data-testid="dict-back-btn" style={st.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={st.hCenter}>
          <Text style={st.hTitle}>Diccionario Anatomico</Text>
          <Text style={st.hSub}>Terminologia veterinaria</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <View style={st.tabs}>
        <TouchableOpacity
          data-testid="tab-glossary"
          style={[st.tab, tab === 'glossary' && st.tabActive]}
          onPress={() => setTab('glossary')}
        >
          <Ionicons name="book-outline" size={16} color={tab === 'glossary' ? '#1a1a2e' : '#888'} />
          <Text style={[st.tabText, tab === 'glossary' && st.tabTextActive]}>Glosario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          data-testid="tab-quiz"
          style={[st.tab, tab === 'quiz' && st.tabActive]}
          onPress={() => setTab('quiz')}
        >
          <Ionicons name="school-outline" size={16} color={tab === 'quiz' ? '#1a1a2e' : '#888'} />
          <Text style={[st.tabText, tab === 'quiz' && st.tabTextActive]}>Mini-Quiz</Text>
        </TouchableOpacity>
      </View>

      {tab === 'glossary' ? <GlossaryTab onSelectTerm={() => {}} /> : <QuizTab />}
    </SafeScreen>
  );
}

const st = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  hCenter: { flex: 1, alignItems: 'center' },
  hTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  hSub: { fontSize: 10, color: '#4ECDC4' },
  tabs: { flexDirection: 'row', marginHorizontal: 10, marginTop: 10, backgroundColor: '#16213e', borderRadius: 10, padding: 3 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  tabActive: { backgroundColor: '#4ECDC4' },
  tabText: { color: '#888', fontWeight: '600', fontSize: 13, marginLeft: 5 },
  tabTextActive: { color: '#1a1a2e' },
  scrollContent: { padding: 10, paddingBottom: 40 },
  imgCard: { backgroundColor: '#0f1629', borderRadius: 10, overflow: 'hidden', marginBottom: 12 },
  refImg: { width: '100%', height: 260 },
  sectionTitle: { color: '#888', fontSize: 13, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  termCard: { backgroundColor: '#16213e', borderRadius: 10, marginBottom: 8, padding: 12, borderWidth: 2, borderColor: '#2a2a4a' },
  termHeader: { flexDirection: 'row', alignItems: 'center' },
  termIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  termName: { flex: 1, fontSize: 16, fontWeight: '700' },
  termBody: { marginTop: 10 },
  termDef: { color: '#ccc', fontSize: 14, lineHeight: 22 },
  exampleBox: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8, backgroundColor: 'rgba(78,205,196,0.08)', padding: 10, borderRadius: 8 },
  exampleText: { color: '#4ECDC4', fontSize: 13, marginLeft: 8, flex: 1, lineHeight: 20 },
  // Quiz styles
  quizProgress: { height: 4, backgroundColor: '#16213e', borderRadius: 2, marginBottom: 4 },
  quizBar: { height: 4, backgroundColor: '#4ECDC4', borderRadius: 2 },
  quizCounter: { color: '#888', fontSize: 12, textAlign: 'right', marginBottom: 10 },
  questionCard: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#4ECDC4' },
  questionLabel: { color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  questionDef: { color: '#fff', fontSize: 16, lineHeight: 24, fontWeight: '500' },
  option: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 2 },
  optLetter: { color: '#555', fontWeight: '700', fontSize: 15, width: 26 },
  optText: { color: '#fff', fontSize: 15, flex: 1 },
  actionBtn: { backgroundColor: '#4ECDC4', borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  actionDisabled: { opacity: 0.4 },
  actionTxt: { color: '#fff', fontSize: 15, fontWeight: '600', marginRight: 6 },
  resultContent: { padding: 16, alignItems: 'center', justifyContent: 'center', flex: 1 },
  resultCard: { backgroundColor: '#16213e', borderRadius: 16, padding: 24, alignItems: 'center', width: '100%', marginBottom: 16 },
  resultEmoji: { fontSize: 48, marginBottom: 8 },
  resultPct: { fontSize: 48, fontWeight: 'bold', color: '#4ECDC4' },
  resultLabel: { fontSize: 18, color: '#fff', fontWeight: '600', marginTop: 4 },
  resultRow: { flexDirection: 'row', marginTop: 16 },
  resultOk: { color: '#33CC33', fontSize: 14, marginRight: 16 },
  resultBad: { color: '#FF3333', fontSize: 14 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4ECDC4', borderRadius: 10, padding: 14, width: '100%' },
  retryTxt: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 6 },
});
