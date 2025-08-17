'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface InteractiveQuizProps {
  title?: string;
  questions: QuizQuestion[];
  className?: string;
}

export function InteractiveQuiz({ 
  title = "知识小测验", 
  questions, 
  className = "" 
}: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  if (showResults) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">测验完成！</h3>
          <div className="text-3xl font-bold text-gray-900 mb-2">{score}/{questions.length}</div>
          <div className={`text-lg font-medium mb-4 ${
            percentage >= 80 ? 'text-green-600' : 
            percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {percentage >= 80 ? '🎉 优秀！' : 
             percentage >= 60 ? '👍 不错！' : '💪 继续努力！'}
            正确率 {percentage}%
          </div>
        </div>

        {/* 答案解析 */}
        <div className="space-y-4 mt-6">
          <h4 className="font-semibold text-gray-900">答案解析：</h4>
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {index + 1}. {question.question}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">正确答案：</span>
                      {question.options[question.correctAnswer]}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-red-600 mb-2">
                        <span className="font-medium">你的答案：</span>
                        {userAnswer !== undefined ? question.options[userAnswer] : '未选择'}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">解析：</span>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={resetQuiz}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>重新测验</span>
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🧠 {title}</h3>
        <span className="text-sm text-gray-500">
          {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 问题 */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {currentQ.question}
        </h4>
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 按钮 */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          上一题
        </button>
        <button
          onClick={nextQuestion}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestion === questions.length - 1 ? '完成测验' : '下一题'}
        </button>
      </div>
    </div>
  );
}