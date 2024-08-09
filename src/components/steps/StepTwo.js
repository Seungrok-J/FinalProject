import React, { useState } from 'react';
import { ChatIcon } from '@heroicons/react/solid';
import Chatbot from '../ChatbotModal';

const budgetOptions = [
  { label: "비쌈", value: "expensive" },
  { label: "중간", value: "moderate" },
  { label: "저렴", value: "cheap" },
  { label: "무관", value: "irrelevant" }
];

const StepTwo = ({ onNext, onBack, data }) => {
  const [selectedBudget, setSelectedBudget] = useState(data.budget);

  const handleChange = (event) => {
    setSelectedBudget(event.target.value);
  };

  const handleNext = () => {
    onNext({ ...data, budget: selectedBudget });
  };


  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">금액 설정</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {budgetOptions.map((option, index) => (
          <label key={index} className="relative">
            <input
              type="radio"
              name="budget"
              value={option.value}
              checked={selectedBudget === option.value}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`cursor-pointer p-4 rounded-xl transition-all duration-200 ease-in-out ${selectedBudget === option.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {option.label}
            </div>
          </label>
        ))}
      </div>
      <div className="mt-10 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          다음
        </button>
      </div>
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 p-4 bg-blue-500 rounded-full text-white hover:bg-blue-600 focus:outline-none shadow-lg transition duration-300 transform hover:scale-110"
        aria-label="Open chatbot"
      >
        <ChatIcon className="h-8 w-8" />
      </button>
      {isChatVisible && <Chatbot onClose={toggleChat} />}
    </div>
  );
};

export default StepTwo;