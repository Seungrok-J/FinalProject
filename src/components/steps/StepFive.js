import React, { useState } from 'react';
import { ChatIcon, ChevronDownIcon } from '@heroicons/react/solid';
import Chatbot from '../ChatbotModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../../hooks/useTheme';

const StepFive = ({ onBack, onSubmit, data, setData }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isExamplesVisible, setIsExamplesVisible] = useState(false);

  const handleChange = (event) => {
    setData({ ...data, details: event.target.value });
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const toggleExamples = () => {
    setIsExamplesVisible(!isExamplesVisible);
  };

  const text = {
    heading: language === 'KO' ? '세부 정보 입력' : 'Enter Details',
    placeholder: language === 'KO' ? 'CAD 도면에 대한 상세 요구사항을 입력하세요.' : 'Enter detailed requirements for CAD blueprints.',
    backButton: language === 'KO' ? '이전' : 'Back',
    submitButton: language === 'KO' ? '결과 보기' : 'View Results',
    examples: language === 'KO' ? '입력 예시 보기' : 'View Input Examples',
    exampleList: [
      language === 'KO' ? '벨트 컨베이어 시스템의 전체 도면을 제공해주세요.' : 'Please provide a complete blueprint of the belt conveyor system.',
      language === 'KO' ? '스카라 로봇의 도면을 제공해주세요.' : 'Please provide a blueprint for the scara robot.',
      language === 'KO' ? '고정 브라켓의 세부 도면을 제공해주세요.' : 'Please provide a detailed drawing of the fixed bracket.'
    ]
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-5xl font-extrabold text-center mb-12 ${
          isDark ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          {text.heading}
        </h2>
        <div className="mb-8 relative">
          <textarea
            id="details"
            value={data.details || ''}
            onChange={handleChange}
            placeholder={text.placeholder}
            className={`w-full p-6 h-60 border-0 rounded-2xl focus:ring-4 focus:ring-indigo-500 focus:outline-none transition duration-300 resize-none ${
              isDark
                ? 'bg-gray-800 text-white placeholder-gray-500'
                : 'bg-white text-gray-900 placeholder-gray-400'
            } shadow-lg backdrop-blur-sm bg-opacity-80`}
          ></textarea>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl -z-10 blur opacity-20"></div>
        </div>
        <div className="mb-8">
          <button
            onClick={toggleExamples}
            className={`w-full py-4 px-6 flex items-center justify-between rounded-xl transition duration-300 ${
              isDark
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } shadow-md`}
          >
            <span className="font-semibold">{text.examples}</span>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform duration-300 ${isExamplesVisible ? 'transform rotate-180' : ''}`}
            />
          </button>
          {isExamplesVisible && (
            <div className={`mt-4 p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <ul className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {text.exampleList.map((example, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0 ${
                      isDark ? 'bg-indigo-500' : 'bg-indigo-400'
                    } text-white text-sm flex items-center justify-center`}>{index + 1}</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className={`px-10 py-4 rounded-full transition duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } border border-gray-300`}
          >
            {text.backButton}
          </button>
          <button
            onClick={onSubmit}
            className={`px-10 py-4 text-white rounded-full transition duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
              isDark
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            }`}
          >
            {text.submitButton}
          </button>
        </div>
      </div>
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white hover:from-blue-600 hover:to-indigo-600 focus:outline-none shadow-lg transition duration-300 transform hover:scale-110"
        aria-label="Open chatbot"
      >
        <ChatIcon className="h-8 w-8" />
      </button>
      {isChatVisible && <Chatbot onClose={toggleChat} />}
    </div>
  );
};

export default StepFive;