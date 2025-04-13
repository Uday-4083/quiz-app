import { useState, useEffect, useCallback } from 'react';
import Welcome from './components/Welcome';
import Question from './components/Question';
import Results from './components/Results';
import { Question as QuestionType, UserAnswer, QuizData } from './types';
import quizData from './data/quiz-data.json';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionType[]>([]);

  const allQuestions = (quizData as QuizData).data.questions;

  // Initialize selected answers when starting quiz or moving to next question
  useEffect(() => {
    if (quizStarted && selectedQuestions[currentQuestionIndex]) {
      const totalBlanks = selectedQuestions[currentQuestionIndex].question.split('_____________').length - 1;
      setSelectedAnswers(new Array(totalBlanks).fill(''));
    }
  }, [quizStarted, currentQuestionIndex, selectedQuestions]);

  useEffect(() => {
    let timer: number;
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, timeRemaining]);

  const handleTimeUp = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      handleNextQuestion();
    } else {
      handleQuizComplete();
    }
  };

  const handleStartQuiz = (numQuestions: number) => {
    // Randomly select questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, numQuestions));
    setQuizStarted(true);
    setTimeRemaining(30);
  };

  const handleSelectAnswer = (answer: string, index: number) => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = answer;
      return newAnswers;
    });
  };

  const handleUnselectAnswer = (index: number) => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = '';
      return newAnswers;
    });
  };

  const handleAnswerSubmit = useCallback((answers: string[]) => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const isCorrect = answers.every(
      (answer, index) => answer === currentQuestion.correctAnswer[index]
    );

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.questionId,
        answers,
        isCorrect
      }
    ]);

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  }, [currentQuestionIndex, selectedQuestions]);

  const handleQuizComplete = () => {
    // Add the last question's answer before completing
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer.every(
      (answer, index) => answer === selectedAnswers[index]
    );

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.questionId,
        answers: [...selectedAnswers],
        isCorrect,
      },
    ]);
    setQuizCompleted(true);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeRemaining(30);
    setUserAnswers([]);
    setSelectedQuestions([]);
  };

  const areAllBlanksFilledForCurrentQuestion = () => {
    if (!selectedQuestions[currentQuestionIndex]) return false;
    const totalBlanks = selectedQuestions[currentQuestionIndex].question.split('_____________').length - 1;
    return selectedAnswers.length === totalBlanks &&
      selectedAnswers.every(answer => answer !== '');
  };

  if (!quizStarted) {
    return <Welcome onStart={handleStartQuiz} />;
  }

  if (quizCompleted) {
    return (
      <Results
        questions={selectedQuestions}
        userAnswers={userAnswers}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <Question
        question={selectedQuestions[currentQuestionIndex]}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={selectedQuestions.length}
        questionNumber={currentQuestionIndex + 1}
        onSubmit={handleAnswerSubmit}
      />
    </div>
  );
}

export default App; 