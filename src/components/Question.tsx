import React, { useState, useEffect, useCallback } from 'react';
import { Question as QuestionType } from '../types';
import { FaCheckCircle, FaUndo, FaKeyboard, FaArrowRight } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface QuestionProps {
  question: QuestionType;
  currentQuestionIndex: number;
  totalQuestions: number;
  onSubmit: (answers: string[]) => void;
  questionNumber: number;
}

const Question: React.FC<QuestionProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onSubmit,
  questionNumber,
}) => {
  const parts = question.question.split('_____________');
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array(parts.length - 1).fill('')
  );
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [activeBlankIndex, setActiveBlankIndex] = useState(0);
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);

  const isAllAnswersFilled = selectedAnswers.every(answer => answer !== '');

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswers(Array(parts.length - 1).fill(''));
    setTimeRemaining(30);
    setActiveBlankIndex(0);
  }, [currentQuestionIndex, parts.length]);

  const handleOptionSelect = useCallback((option: string) => {
    if (selectedAnswers.includes(option)) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[activeBlankIndex] = option;
    setSelectedAnswers(newAnswers);

    // Move to next blank if available
    const nextBlankIndex = parts.findIndex((_, index) => 
      index > activeBlankIndex && !newAnswers[index]
    );
    
    if (nextBlankIndex !== -1) {
      setActiveBlankIndex(nextBlankIndex);
    }
  }, [selectedAnswers, activeBlankIndex, parts]);

  const handleUnselectAnswer = useCallback((index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = '';
    setSelectedAnswers(newAnswers);
    setActiveBlankIndex(index);
  }, [selectedAnswers]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all answers?')) {
      setSelectedAnswers(Array(parts.length - 1).fill(''));
      setActiveBlankIndex(0);
    }
  }, [parts.length]);

  const handleNextQuestion = useCallback(() => {
    if (isAllAnswersFilled) {
      onSubmit(selectedAnswers);
    }
  }, [isAllAnswersFilled, selectedAnswers, onSubmit]);

  // Timer effect
  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const timer = setInterval(() => {
      if (!isMounted) return;
      
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remaining = 30 - elapsedSeconds;
      
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeRemaining(0);
        if (isAllAnswersFilled) {
          onSubmit(selectedAnswers);
        }
      } else {
        setTimeRemaining(remaining);
      }
    }, 100);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [currentQuestionIndex]); // Only reset timer when question changes

  // Keyboard navigation with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const optionKeys = ['1', '2', '3', '4'];
        if (optionKeys.includes(e.key)) {
          const optionIndex = parseInt(e.key) - 1;
          if (optionIndex < question.options.length) {
            handleOptionSelect(question.options[optionIndex]);
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          setActiveBlankIndex((prev) => (prev + 1) % (parts.length - 1));
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          handleUnselectAnswer(activeBlankIndex);
        } else if (e.key === 'Enter' && isAllAnswersFilled) {
          handleNextQuestion();
        }
      }, 50); // Small debounce to prevent rapid-fire
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeBlankIndex, question.options, parts.length, handleOptionSelect, handleUnselectAnswer, isAllAnswersFilled, handleNextQuestion]);

  // Add warning for low time
  useEffect(() => {
    if (timeRemaining === 5) {
      const warningEl = document.createElement('div');
      warningEl.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg animate-pulse';
      warningEl.textContent = '5 seconds remaining!';
      document.body.appendChild(warningEl);
      
      setTimeout(() => {
        warningEl.remove();
      }, 2000);
    }
  }, [timeRemaining]);

  const getTimerColor = () => {
    if (timeRemaining > 10) return '#22D3EE'; // cyan-400
    if (timeRemaining > 5) return '#38BDF8'; // sky-400
    return '#FB7185'; // rose-400
  };

  const renderQuestion = () => {
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        <span className="text-blue-200 text-2xl">{part}</span>
        {index < parts.length - 1 && (
          <div className="relative inline-block">
            <button
              onClick={() => setActiveBlankIndex(index)}
              className={`inline-block mx-2 min-w-[120px] px-4 py-2 rounded-lg text-xl font-semibold transition-all duration-300 ${
                selectedAnswers[index]
                  ? 'bg-blue-600 bg-opacity-30 text-blue-300 border-blue-500 hover:bg-opacity-40'
                  : 'bg-white bg-opacity-10 text-gray-300 border-gray-600'
              } border border-opacity-50 ${
                activeBlankIndex === index ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
              }`}
            >
              {selectedAnswers[index] || '_____'}
            </button>
            {index === activeBlankIndex && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm">
                Active
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col space-y-2">
        {/* Progress and Timer */}
        <div className="flex justify-between items-center">
          <span className="text-lg text-cyan-200">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div style={{ width: 40, height: 40 }}>
            <CircularProgressbar
              value={(timeRemaining / 30) * 100}
              text={`${timeRemaining}s`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: getTimerColor(),
                textColor: getTimerColor(),
                trailColor: 'rgba(255, 255, 255, 0.15)',
              })}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-white bg-opacity-10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-filter backdrop-blur-lg rounded-xl p-4 shadow-lg border border-cyan-500/20">
          {/* Keyboard Hint */}
          {showKeyboardHint && (
            <div className="bg-cyan-900/40 text-cyan-200 p-2 rounded-lg flex items-center space-x-2 mb-3 text-sm border border-cyan-500/20">
              <FaKeyboard className="text-base flex-shrink-0" />
              <span>
                Pro tip: Use number keys (1-4) to select options, Tab to move between blanks, and
                Backspace to clear a selection
              </span>
              <button
                onClick={() => setShowKeyboardHint(false)}
                className="ml-auto hover:text-cyan-300 whitespace-nowrap text-xs"
              >
                Got it
              </button>
            </div>
          )}

          {/* Question Text */}
          <div className="text-xl leading-relaxed mb-3 text-cyan-100">{renderQuestion()}</div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-2">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={selectedAnswers.includes(option)}
                className={`p-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center ${
                  selectedAnswers.includes(option)
                    ? 'bg-slate-800/50 text-slate-400 cursor-not-allowed'
                    : 'bg-cyan-800/20 text-cyan-200 hover:bg-cyan-700/30 hover:scale-102 border border-cyan-400/20 hover:border-cyan-400/40'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mr-2 text-xs text-white">
                  {index + 1}
                </span>
                <span className="flex-1">{option}</span>
                {selectedAnswers.includes(option) && (
                  <FaCheckCircle className="ml-2 text-slate-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center text-cyan-200 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-2.5 rounded-xl border border-cyan-500/10">
          <div className="flex items-center space-x-3">
            <span className="text-sm">
              {selectedAnswers.filter(Boolean).length} of {parts.length - 1} blanks filled
            </span>
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1 bg-rose-500/20 hover:bg-rose-500/30 px-2.5 py-1.5 rounded-lg transition-all duration-300 text-sm border border-rose-500/20 hover:border-rose-500/30"
            >
              <FaUndo className="text-xs" />
              <span>Clear All</span>
            </button>
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={!isAllAnswersFilled}
            className={`flex items-center space-x-1 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              isAllAnswersFilled
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg'
                : 'bg-slate-500/20 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}</span>
            <FaArrowRight className="ml-1.5 text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question; 