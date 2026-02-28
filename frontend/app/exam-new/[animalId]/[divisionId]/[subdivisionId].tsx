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

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width } = Dimensions.get('window');

interface Question {
  id: string;
  bone_id: string;
  bone_name: string;
  description: string;
  quantity: number;
  image_url: string;
  marker_x: number;
  marker_y: number;
  highlight_color: string;
  options: string[];
  correct_answer: string;
}

interface Exam {
  exam_id: string;
  division: string;
  subdivision: string;
  image_url: string;
  total_questions: number;
  questions: Question[];
}

export default function ExamNewScreen() {
  const router = useRouter();
  const { animalId, divisionId, subdivisionId } = useLocalSearchParams<{
    animalId: string;
    divisionId: string;
    subdivisionId: string;
  }>();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchExam();
  }, []);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/api/exam/${animalId}/${divisionId}/${subdivisionId}?num_questions=5`
      );
      const data = await response.json();
      setExam(data);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      setFinished(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getColorHex = (color: string): string => {
    const colors: { [key: string]: string } = {
      'Rojo': '#FF4444',
      'Azul': '#4488FF',
      'Verde': '#44DD44',
      'Amarillo': '#FFDD00',
      'Naranja': '#FF8800',
      'Morado': '#AA44FF',
    };
    return colors[color] || '#FF4444';
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    if (!selectedAnswer || !exam) return;
    
    const isCorrect = selectedAnswer === exam.questions[currentIndex].correct_answer;
    if (isCorrect) setScore(score + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (!exam) return;
    
    if (currentIndex < exam.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Cargando examen...</Text>
      </SafeAreaView>
    );
  }

  if (!exam) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Error al cargar el examen</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchExam}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Results screen
  if (finished) {
    const percentage = Math.round((score / exam.total_questions) * 100);
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={styles.resultsCard}>
            <View style={[styles.scoreCircle, { borderColor: percentage >= 60 ? '#4ECDC4' : '#FF6B6B' }]}>
              <Text style={[styles.scorePercent, { color: percentage >= 60 ? '#4ECDC4' : '#FF6B6B' }]}>
                {percentage}%
              </Text>
            </View>
            
            <Text style={styles.resultsTitle}>
              {percentage >= 80 ? '¡Excelente!' : percentage >= 60 ? '¡Buen trabajo!' : 'Necesitas practicar más'}
            </Text>
            
            <Text style={styles.resultsSubtitle}>{exam.subdivision}</Text>
            
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
                <Text style={styles.scoreNumber}>{score}</Text>
                <Text style={styles.scoreLabel}>Correctas</Text>
              </View>
              <View style={styles.scoreItem}>
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                <Text style={styles.scoreNumber}>{exam.total_questions - score}</Text>
                <Text style={styles.scoreLabel}>Incorrectas</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.restartButton} onPress={fetchExam}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.restartText}>Repetir Examen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>Volver a las regiones</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const question = exam.questions[currentIndex];
  const markerColor = getColorHex(question.highlight_color);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => Alert.alert('Salir', '¿Deseas salir del examen?', [
            { text: 'No', style: 'cancel' },
            { text: 'Sí', onPress: () => router.back() }
          ])}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.progress}>
          <Text style={styles.progressText}>{currentIndex + 1}/{exam.total_questions}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentIndex + 1) / exam.total_questions) * 100}%` }]} />
          </View>
        </View>
        
        <View style={styles.scoreBox}>
          <Ionicons name="star" size={16} color="#FFEAA7" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Color indicator */}
        <View style={styles.colorIndicator}>
          <View style={[styles.colorDot, { backgroundColor: markerColor }]} />
          <Text style={styles.colorText}>
            Identifica el hueso marcado en{' '}
            <Text style={[styles.colorName, { color: markerColor }]}>{question.highlight_color}</Text>
          </Text>
        </View>

        {/* Image with marker */}
        <View style={styles.imageCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: question.image_url }}
              style={styles.image}
              contentFit="contain"
            />
            {/* Marker */}
            <View style={[
              styles.marker,
              {
                left: `${question.marker_x}%`,
                top: `${question.marker_y}%`,
                borderColor: markerColor,
                backgroundColor: `${markerColor}30`,
              }
            ]}>
              <View style={[styles.markerDot, { backgroundColor: markerColor }]} />
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.descBox}>
            <Ionicons name="information-circle" size={18} color={markerColor} />
            <View style={styles.descContent}>
              <Text style={styles.descText}>{question.description}</Text>
              {question.quantity > 1 && (
                <Text style={styles.quantityText}>Cantidad: {question.quantity}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correct_answer;
            
            let optionStyle = styles.option;
            let textStyle = styles.optionText;
            
            if (showResult) {
              if (isCorrect) {
                optionStyle = styles.optionCorrect;
                textStyle = styles.optionTextCorrect;
              } else if (isSelected) {
                optionStyle = styles.optionWrong;
                textStyle = styles.optionTextWrong;
              }
            } else if (isSelected) {
              optionStyle = styles.optionSelected;
              textStyle = styles.optionTextSelected;
            }
            
            return (
              <TouchableOpacity
                key={idx}
                style={optionStyle}
                onPress={() => handleAnswer(option)}
                disabled={showResult}
              >
                <View style={styles.optionLetter}>
                  <Text style={styles.letterText}>{String.fromCharCode(65 + idx)}</Text>
                </View>
                <Text style={textStyle}>{option}</Text>
                {showResult && isCorrect && (
                  <Ionicons name="checkmark-circle" size={22} color="#4ECDC4" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <Ionicons name="close-circle" size={22} color="#FF6B6B" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action button */}
        {!showResult ? (
          <TouchableOpacity
            style={[styles.actionButton, !selectedAnswer && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={!selectedAnswer}
          >
            <Text style={styles.actionText}>Confirmar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.actionText}>
              {currentIndex < exam.questions.length - 1 ? 'Siguiente' : 'Ver Resultados'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  loadingContainer: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  errorText: { color: '#FF6B6B', fontSize: 16, marginTop: 16 },
  retryButton: { backgroundColor: '#4ECDC4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 },
  retryText: { color: '#fff', fontWeight: '600' },
  
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center' },
  progress: { flex: 1, marginHorizontal: 12 },
  progressText: { color: '#888', fontSize: 12, textAlign: 'center', marginBottom: 4 },
  progressBar: { height: 4, backgroundColor: '#2a2a4a', borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: '#4ECDC4', borderRadius: 2 },
  scoreBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  scoreText: { color: '#FFEAA7', fontWeight: 'bold', marginLeft: 4 },
  
  content: { padding: 12 },
  
  colorIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', padding: 12, borderRadius: 10, marginBottom: 12 },
  colorDot: { width: 18, height: 18, borderRadius: 9, marginRight: 10 },
  colorText: { color: '#fff', fontSize: 14, flex: 1 },
  colorName: { fontWeight: 'bold' },
  
  imageCard: { backgroundColor: '#0a0a1a', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  imageWrapper: { position: 'relative', backgroundColor: '#fff' },
  image: { width: '100%', height: 280 },
  marker: { position: 'absolute', width: 36, height: 36, borderRadius: 18, borderWidth: 3, marginLeft: -18, marginTop: -18, justifyContent: 'center', alignItems: 'center' },
  markerDot: { width: 10, height: 10, borderRadius: 5 },
  descBox: { flexDirection: 'row', padding: 12, backgroundColor: '#16213e' },
  descContent: { flex: 1, marginLeft: 10 },
  descText: { color: '#ccc', fontSize: 13, lineHeight: 18 },
  quantityText: { color: '#4ECDC4', fontSize: 12, marginTop: 4 },
  
  options: { marginBottom: 12 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 2, borderColor: '#2a2a4a' },
  optionSelected: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 2, borderColor: '#4ECDC4' },
  optionCorrect: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(78, 205, 196, 0.1)', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 2, borderColor: '#4ECDC4' },
  optionWrong: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 107, 107, 0.1)', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 2, borderColor: '#FF6B6B' },
  optionLetter: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2a2a4a', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  letterText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  optionText: { flex: 1, color: '#fff', fontSize: 14 },
  optionTextSelected: { flex: 1, color: '#4ECDC4', fontSize: 14, fontWeight: '500' },
  optionTextCorrect: { flex: 1, color: '#4ECDC4', fontSize: 14, fontWeight: '500' },
  optionTextWrong: { flex: 1, color: '#FF6B6B', fontSize: 14, fontWeight: '500' },
  
  actionButton: { backgroundColor: '#4ECDC4', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#2a2a4a' },
  nextButton: { backgroundColor: '#45B7D1', borderRadius: 10, padding: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 },
  
  resultsContainer: { padding: 20, alignItems: 'center' },
  resultsCard: { backgroundColor: '#16213e', borderRadius: 20, padding: 30, alignItems: 'center', width: '100%', marginBottom: 20 },
  scoreCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  scorePercent: { fontSize: 36, fontWeight: 'bold' },
  resultsTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  resultsSubtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  scoreItem: { alignItems: 'center' },
  scoreNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  scoreLabel: { fontSize: 12, color: '#888' },
  restartButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4ECDC4', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10, marginBottom: 12 },
  restartText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  backButton: { padding: 14 },
  backText: { color: '#888', fontSize: 14 },
});
