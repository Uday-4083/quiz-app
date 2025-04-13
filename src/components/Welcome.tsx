import React, { useState } from 'react';
import { FaPlay, FaQuestionCircle } from 'react-icons/fa';

interface WelcomeProps {
  onStart: (numQuestions: number) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [numQuestions, setNumQuestions] = useState(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white bg-opacity-15 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white border-opacity-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Quiz!</h1>
          <p className="text-xl text-blue-200 mb-6">Test your knowledge with our interactive quiz</p>
          
          {/* Instructions */}
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-lg font-bold text-white mb-2">Quick Instructions:</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">1</span>
                <span>Each question has multiple blanks to fill</span>
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">2</span>
                <span>Use number keys (1-4) to select options quickly</span>
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">3</span>
                <span>30 seconds timer for each question</span>
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">4</span>
                <span>Complete all questions to see your score</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <label className="block text-blue-200 text-lg mb-2">Number of Questions:</label>
            <div className="flex justify-center gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumQuestions(num)}
                  className={`px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-300 ${
                    numQuestions === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-white bg-opacity-10 text-blue-200 hover:bg-opacity-20'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onStart(numQuestions)}
            className="w-full flex items-center justify-center py-3 px-6 text-xl font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl"
          >
            <FaPlay className="mr-2" />
            Start Quiz
          </button>

          <div className="mt-4 text-sm text-blue-200 flex items-center justify-center">
            <FaQuestionCircle className="mr-1" />
            <span>Select number of questions and click Start</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 