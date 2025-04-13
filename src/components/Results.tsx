import React from 'react';
import { Question, UserAnswer } from '../types';
import { FaTrophy, FaRedo, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';

interface ResultsProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ questions, userAnswers, onRestart }) => {
  const totalQuestions = questions.length;
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  const getScoreBackground = () => {
    if (percentage >= 80) return 'from-green-600 to-green-700';
    if (percentage >= 60) return 'from-yellow-600 to-yellow-700';
    return 'from-red-600 to-red-700';
  };

  const renderAnswerComparison = (question: Question, userAnswer: UserAnswer, index: number) => {
    const parts = question.question.split('_____________');
    const isCorrect = userAnswer.isCorrect;

    return (
      <div
        key={question.questionId}
        className="bg-white bg-opacity-15 backdrop-filter backdrop-blur-lg rounded-xl p-6 transition-all duration-300 hover:bg-opacity-20 border border-white border-opacity-20"
      >
        <div className="space-y-4">
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex-shrink-0 rounded-full p-2 ${
                isCorrect ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'
              }`}>
                {isCorrect ? (
                  <FaCheck className="h-6 w-6 text-green-400" />
                ) : (
                  <FaTimes className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div className="text-xl font-bold text-white">Question {index + 1}</div>
            </div>
            <div className={`text-lg font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </div>
          </div>

          {/* Question Text with Answers */}
          <div className="text-lg text-blue-200 leading-relaxed mb-6">
            {parts.map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <div className="inline-flex items-center mx-2">
                    <span className={`px-3 py-1 rounded-lg font-bold ${
                      userAnswer.answers[i] === question.correctAnswer[i]
                        ? 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500 border-opacity-50'
                        : 'bg-red-500 bg-opacity-20 text-red-300 border border-red-500 border-opacity-50'
                    }`}>
                      {userAnswer.answers[i]}
                    </span>
                    {userAnswer.answers[i] !== question.correctAnswer[i] && (
                      <>
                        <FaArrowRight className="mx-2 text-blue-300" />
                        <span className="px-3 py-1 rounded-lg font-bold bg-blue-500 bg-opacity-20 text-blue-300 border border-blue-500 border-opacity-50">
                          {question.correctAnswer[i]}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Answer Details */}
          <div className="bg-blue-900 bg-opacity-30 rounded-xl p-4 border border-blue-500 border-opacity-20">
            <div className="grid grid-cols-2 gap-3">
              {userAnswer.answers.map((answer, i) => (
                <div key={i} className={`p-4 rounded-xl ${
                  answer === question.correctAnswer[i]
                    ? 'bg-green-500 bg-opacity-10 border-green-500'
                    : 'bg-red-500 bg-opacity-10 border-red-500'
                } border border-opacity-30 backdrop-blur-lg`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center text-sm text-blue-200 mr-2">
                        {i + 1}
                      </span>
                      <span className="text-blue-200 font-medium">Blank {i + 1}</span>
                    </div>
                    {answer === question.correctAnswer[i] ? (
                      <div className="flex items-center text-green-400 bg-green-500 bg-opacity-10 px-2 py-1 rounded-lg">
                        <FaCheck className="mr-1" />
                        <span>Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400 bg-red-500 bg-opacity-10 px-2 py-1 rounded-lg">
                        <FaTimes className="mr-1" />
                        <span>Wrong</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center bg-white bg-opacity-5 p-2 rounded-lg">
                      <span className="text-blue-200 mr-2">You selected:</span>
                      <span className={`font-medium ${
                        answer === question.correctAnswer[i] ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {answer || 'No selection'}
                      </span>
                    </div>
                    {answer !== question.correctAnswer[i] && (
                      <div className="flex items-center bg-white bg-opacity-5 p-2 rounded-lg">
                        <span className="text-blue-200 mr-2">Correct answer:</span>
                        <span className="text-blue-300 font-medium">{question.correctAnswer[i]}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <div className="bg-white bg-opacity-15 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl mb-8 border border-white border-opacity-20">
          <div className="text-center">
            <div className={`inline-block p-6 rounded-full bg-gradient-to-br ${getScoreBackground()} mb-6 shadow-lg`}>
              <FaTrophy className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h2>
            <p className="text-xl text-blue-200 mb-8">{getScoreMessage()}</p>
            
            <div className="flex justify-center items-center">
              <div className="text-center bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className={`text-7xl font-bold mb-3 ${getScoreColor()}`}>
                  {percentage}%
                </div>
                <div className="text-lg text-blue-200">
                  {correctAnswers} out of {totalQuestions} correct
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="w-8 h-8 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center text-blue-300 mr-3">
              <FaCheck className="text-lg" />
            </span>
            Question Review
          </h3>
          <div className="space-y-6">
            {questions.map((question, index) => 
              renderAnswerComparison(question, userAnswers[index], index)
            )}
          </div>
        </div>

        {/* Restart Button */}
        <div className="mt-8">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center py-4 px-6 text-xl font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl"
          >
            <FaRedo className="mr-3 text-xl" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results; 