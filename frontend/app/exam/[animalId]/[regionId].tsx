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
  Alert,
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
  region: string;
  image_url: string;
  options: string[];
  correct_answer: string;
  highlight_description: string;
}

interface Exam {
  exam_id: string;
  animal: string;
  region: string;
  region_name: string;
  total_questions: number;
  questions: Question[];
}

export default function ExamScreen() {
  const router = useRouter();
  const { animalId, regionId } = useLocalSearchParams<{
    animalId: string;
    regionId: string;
  }>();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: { selected: string; correct: boolean } }>({});
  const [examFinished, setExamFinished] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [animalId, regionId]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${BACKEND_URL}/api/exam/${animalId}/${regionId}?num_questions=5`
      );
      if (!response.ok) throw new Error('Error al generar examen');
      const data = await response.json();
      setExam(data);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      setAnswers({});
      setExamFinished(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnswer || !exam) return;
    
    const currentQuestion = exam.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnswers({
      ...answers,
      [currentQuestionIndex]: {
        selected: selectedAnswer,
        correct: isCorrect,
      },
    });
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (!exam) return;
    
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setExamFinished(true);
    }
  };

  const handleRestartExam = () => {
    fetchExam();
  };

  const getOptionStyle = (option: string, currentQuestion: Question) => {
    if (!showResult) {
      return option === selectedAnswer ? styles.optionSelected : styles.option;
    }
    
    if (option === currentQuestion.correct_answer) {
      return styles.optionCorrect;
    }
    
    if (option === selectedAnswer && option !== currentQuestion.correct_answer) {
      return styles.optionIncorrect;
    }
    
    return styles.option;
  };

  const getOptionTextStyle = (option: string, currentQuestion: Question) => {
    if (!showResult) {
      return option === selectedAnswer ? styles.optionTextSelected : styles.optionText;
    }
    
    if (option === currentQuestion.correct_answer) {
      return styles.optionTextCorrect;
    }
    
    if (option === selectedAnswer && option !== currentQuestion.correct_answer) {
      return styles.optionTextIncorrect;
    }
    
    return styles.optionText;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Generando examen...</Text>
      </SafeAreaView>
    );
  }

  if (error || !exam) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error || 'No se pudo cargar el examen'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchExam}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (examFinished) {
    const percentage = Math.round((score / exam.total_questions) * 100);
    let resultMessage = '';
    let resultColor = '#4ECDC4';
    
    if (percentage >= 80) {
      resultMessage = '¡Excelente!';
      resultColor = '#4ECDC4';
    } else if (percentage >= 60) {
      resultMessage = '¡Buen trabajo!';
      resultColor = '#45B7D1';
    } else if (percentage >= 40) {
      resultMessage = 'Puedes mejorar';
      resultColor = '#FFEAA7';
    } else {
      resultMessage = 'Necesitas más práctica';
      resultColor = '#FF6B6B';
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <View style={styles.resultCard}>
            <View style={[styles.scoreCircle, { borderColor: resultColor }]}>
              <Text style={[styles.scorePercentage, { color: resultColor }]}>
                {percentage}%
              </Text>
              <Text style={styles.scoreLabel}>Aciertos</Text>
            </View>
            
            <Text style={[styles.resultMessage, { color: resultColor }]}>
              {resultMessage}
            </Text>
            
            <View style={styles.scoreDetails}>
              <View style={styles.scoreDetailItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
                <Text style={styles.scoreDetailNumber}>{score}</Text>
                <Text style={styles.scoreDetailLabel}>Correctas</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreDetailItem}>
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                <Text style={styles.scoreDetailNumber}>
                  {exam.total_questions - score}
                </Text>
                <Text style={styles.scoreDetailLabel}>Incorrectas</Text>
              </View>
            </View>
            
            <Text style={styles.regionInfo}>
              Región: {exam.region_name}
            </Text>
          </View>
          
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={handleRestartExam}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.restartButtonText}>Repetir Examen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.changeRegionButton}
              onPress={() => router.back()}
            >
              <Ionicons name="body-outline" size={20} color="#4ECDC4" />
              <Text style={styles.changeRegionButtonText}>Cambiar Región</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.push('/')}
            >
              <Ionicons name="home-outline" size={20} color="#888" />
              <Text style={styles.homeButtonText}>Ir al Inicio</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              'Salir del Examen',
              '¿Estás seguro de que deseas salir? Perderás tu progreso.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Salir', onPress: () => router.back() },
              ]
            );
          }}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Pregunta {currentQuestionIndex + 1} de {exam.total_questions}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestionIndex + 1) / exam.total_questions) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
        
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={16} color="#FFEAA7" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.examContent}>
        {/* Region Badge */}
        <View style={styles.regionBadge}>
          <Ionicons name="fitness-outline" size={16} color="#4ECDC4" />
          <Text style={styles.regionBadgeText}>{exam.region_name}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Identifica el hueso</Text>
          <Text style={styles.questionDescription}>
            {currentQuestion.highlight_description}
          </Text>
          
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentQuestion.image_url }}
              style={styles.boneImage}
              contentFit="contain"
              transition={200}
            />
            <View style={styles.imageOverlay}>
              <View style={styles.highlightIndicator}>
                <Ionicons name="locate" size={20} color="#FF6B6B" />
                <Text style={styles.highlightText}>Hueso señalado</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Selecciona tu respuesta:</Text>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(option, currentQuestion)}
              onPress={() => handleAnswerSelect(option)}
              disabled={showResult}
              activeOpacity={0.7}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={getOptionTextStyle(option, currentQuestion)}>
                {option}
              </Text>
              {showResult && option === currentQuestion.correct_answer && (
                <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
              )}
              {showResult &&
                option === selectedAnswer &&
                option !== currentQuestion.correct_answer && (
                  <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!showResult ? (
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedAnswer && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmAnswer}
              disabled={!selectedAnswer}
            >
              <Text style={styles.confirmButtonText}>Confirmar Respuesta</Text>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < exam.questions.length - 1
                  ? 'Siguiente Pregunta'
                  : 'Ver Resultados'}
              </Text>
              <Ionicons
                name={currentQuestionIndex < exam.questions.length - 1 ? 'arrow-forward' : 'trophy'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2a2a4a',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  scoreText: {
    color: '#FFEAA7',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  examContent: {
    padding: 16,
  },
  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  regionBadgeText: {
    color: '#4ECDC4',
    marginLeft: 6,
    fontWeight: '500',
  },
  questionCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  questionDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 16,
    lineHeight: 20,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0f1629',
  },
  boneImage: {
    width: '100%',
    height: 350,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  highlightIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightText: {
    color: '#FF6B6B',
    marginLeft: 8,
    fontSize: 13,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionsTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#2a2a4a',
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  optionIncorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a2a4a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionLetterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  optionTextSelected: {
    flex: 1,
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  optionTextCorrect: {
    flex: 1,
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  optionTextIncorrect: {
    flex: 1,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: '#2a2a4a',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B7D1',
    borderRadius: 12,
    padding: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  backButtonLarge: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#888',
  },
  resultContainer: {
    padding: 16,
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scorePercentage: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#888',
  },
  resultMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  scoreDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreDetailItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  scoreDetailNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  scoreDetailLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  scoreDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#2a2a4a',
  },
  regionInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  resultActions: {
    width: '100%',
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  changeRegionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  changeRegionButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  homeButtonText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 8,
  },
});
