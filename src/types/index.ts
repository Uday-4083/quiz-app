export interface Option {
  text: string;
}

export interface Question {
  questionId: string;
  question: string;
  questionType: string;
  answerType: string;
  options: string[];
  correctAnswer: string[];
}

export interface QuizData {
  status: string;
  data: {
    testId: string;
    questions: Question[];
  };
  message: string;
  activity: {
    id: string;
    userId: string;
    type: string;
    coinType: string;
    coins: number;
    description: string;
    createdAt: string;
  };
}

export interface UserAnswer {
  questionId: string;
  answers: string[];
  isCorrect: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  questions: Question[];
  userAnswers: UserAnswer[];
  timeRemaining: number;
  quizCompleted: boolean;
} 