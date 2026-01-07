import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, Check, Sparkles, Target, TrendingUp, Award } from 'lucide-react';
import api from '../utils/api';

const RoleDiscoveryQuiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get('/role-discovery/questions');
      setQuestions(data.questions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    const currentQ = questions[currentQuestion];
    
    if (currentQ.multiSelect) {
      // Multi-select: toggle option
      const newSelected = selectedOptions.includes(option)
        ? selectedOptions.filter(o => o !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newSelected);
    } else {
      // Single select: replace
      setSelectedOptions([option]);
    }
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    
    // Save answer
    const answer = currentQ.multiSelect ? selectedOptions : selectedOptions[0];
    setAnswers({ ...answers, [currentQ.id]: answer });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptions([]);
    } else {
      // Last question - submit
      submitAnswers({ ...answers, [currentQ.id]: answer });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Load previous answer
      const prevQ = questions[currentQuestion - 1];
      const prevAnswer = answers[prevQ.id];
      setSelectedOptions(Array.isArray(prevAnswer) ? prevAnswer : [prevAnswer]);
    }
  };

  const submitAnswers = async (finalAnswers) => {
    setError('');
    setAnalyzing(true);
    try {
      const { data } = await api.post('/role-discovery/analyze', {
        answers: finalAnswers
      });
      setResult(data);
    } catch (err) {
      console.error('Error analyzing answers:', err);
      setError('Failed to analyze your responses. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateRoadmap = () => {
    if (!result) return;
    const token = localStorage.getItem('authToken');
    const targetState = {
      discoveredRole: result.recommended_role,
      fromRoleDiscovery: true,
      roleDiscoveryResult: result
    };

    if (!token) {
      try {
        sessionStorage.setItem('pendingRoleDiscovery', JSON.stringify({
          recommended_role: result.recommended_role,
          confidence: result.confidence,
          result,
          nextRoute: '/generate',
          state: targetState,
          timestamp: Date.now()
        }));
      } catch (_) {
        // Ignore storage errors
      }
      setError('Please sign in so we can load this role inside the roadmap builder.');
      navigate('/login', { state: { fromRoleDiscovery: true } });
      return;
    }

    // Navigate directly to the roadmap builder with the recommended role
    navigate('/generate', { state: targetState });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Brain className="w-20 h-20 text-purple-600 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Analyzing Your Responses...</h2>
          <p className="text-gray-600 mb-4">
            Our AI is matching your interests and skills to find the perfect career role for you.
          </p>
          <div className="flex justify-center space-x-2">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-3 h-3 bg-purple-600 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-3 h-3 bg-purple-600 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="w-3 h-3 bg-purple-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4"
            >
              <Award className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Perfect Match!</h1>
            <p className="text-gray-600">Based on your interests and skills</p>
          </div>

          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            {/* Recommended Role */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
              <div className="inline-flex items-center space-x-2 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">Recommended Role</h2>
              </div>
              <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                {result.recommended_role}
              </h3>
              
              {/* Confidence Bar */}
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Match Confidence</span>
                  <span className="font-semibold text-purple-600">{result.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                Skill Level: <span className="font-semibold capitalize">{result.skill_level}</span>
              </p>
            </div>

            {/* Explanation */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Why This Role?
              </h4>
              <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
            </div>

            {/* Key Strengths */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Key Strengths</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.key_strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-3 bg-purple-50 p-3 rounded-lg"
                  >
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Next Steps
              </h4>
              <div className="space-y-3">
                {result.next_steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <button
              onClick={handleGenerateRoadmap}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Generate My Personalized Roadmap
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              We'll create a custom learning path for you as a {result.recommended_role}
            </p>
            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Your Perfect Tech Role</h1>
          <p className="text-gray-600">Answer these questions to find your ideal career path</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQ?.question}</h2>

            {currentQ?.multiSelect && (
              <p className="text-sm text-purple-600 mb-4">✨ You can select multiple options</p>
            )}

            <div className="space-y-3">
              {currentQ?.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedOptions.includes(option)
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{option}</span>
                    {selectedOptions.includes(option) && (
                      <Check className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={selectedOptions.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleDiscoveryQuiz;
