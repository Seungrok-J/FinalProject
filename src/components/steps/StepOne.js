import React, { useState } from 'react';
import assemblyDrawingImage from '../../img/assy.png';
import detailedDrawingImage from '../../img/detail.png';
import { ChatIcon } from '@heroicons/react/solid';
import Chatbot from '../ChatbotModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../../hooks/useTheme'; // 테마 훅 추가

const StepOne = ({ onNext, onSetCurrentStep, currentStep, data }) => {
  const [selectedOption, setSelectedOption] = useState(data.detailed || null);
  const { language } = useLanguage();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const { theme } = useTheme(); // 테마 사용
  const text = {
    assemblyTitle: language === 'KO' ? '조립품 도면' : 'Assembly Drawing',
    componentsTitle: language === 'KO' ? '디테일한 도면' : 'Detailed Drawing',
    selectType: language === 'KO' ? '도면 유형 선택' : 'Select Drawing Type',
    nextStep: language === 'KO' ? '다음 단계로' : 'Next Step',
    assemblyDescription: language === 'KO' ? '기본적인 조립품의 구조와 배치를 보여주는 도면입니다. 전체적인 조립 과정과 각 부품의 연결 방식을 이해할 수 있습니다.' : 'Displays the basic structure and arrangement of an assembly. Understand the overall assembly process and how each part connects.',
    componentsDescription: language === 'KO' ? '조립품을 구성하는 각 부품의 상세한 제작 정보를 담은 도면입니다. 각 부품의 치수, 재료, 표면 처리 등의 정보가 포함됩니다.' : 'Detailed drawings of each component that make up an assembly, including dimensions, materials, and surface treatments.',
    select: language === 'KO' ? '선택하려면 클릭하세요' : 'Click to select',
    selected: language === 'KO' ? '선택됨' : 'SELECTED'
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
      let updatedData = { ...data, detailed: selectedOption };
      console.log(selectedOption)
      if (selectedOption === 'Assembly') {
        updatedData.materials = ['Ass\'Y']; // Set materials to Ass'Y if Assembly is selected
        onSetCurrentStep(3); // 조립품 선택 시 Step 3(StepFour)로 이동
      } else {
        onSetCurrentStep(currentStep + 1);
      }
      onNext(updatedData);
    }
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-5xl font-extrabold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}>
          {text.selectType}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {[
            { type: 'Assembly', image: assemblyDrawingImage, title: text.assemblyTitle, description: text.assemblyDescription },
            { type: 'Component', image: detailedDrawingImage, title: text.componentsTitle, description: text.componentsDescription }
          ].map((option) => (
            <div
              key={option.type}
              onClick={() => handleSelectOption(option.type)}
              className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${selectedOption === option.type
                  ? `bg-white shadow-2xl ring-4 ring-blue-400 ${theme === 'dark' ? 'bg-gray-800' : ''}`
                  : `bg-white bg-opacity-60 hover:bg-opacity-100 ${theme === 'dark' ? 'bg-gray-800 bg-opacity-60' : ''}`
                } rounded-3xl overflow-hidden`}
            >
              <div className="relative h-64 overflow-hidden">
                <img src={option.image} alt={option.title} className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <h3 className="absolute bottom-4 left-4 text-3xl font-bold text-white">{option.title}</h3>
              </div>
              <div className="p-8">
                <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{option.description}</p>
                <div className={`text-center font-semibold ${selectedOption === option.type
                    ? 'text-blue-600'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  {selectedOption === option.type ? text.selected : text.select}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className={`px-12 py-4 rounded-full text-xl font-semibold transition duration-300 ${selectedOption
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 hover:shadow-xl'
                : `bg-gray-300 text-gray-500 cursor-not-allowed ${theme === 'dark' ? 'bg-gray-700' : ''}`
              }`}
          >
            {text.nextStep}
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

export default StepOne;