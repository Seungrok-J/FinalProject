import React, { useState } from 'react';
import { ChatIcon } from '@heroicons/react/solid';
import Chatbot from '../ChatbotModal';
import { useLanguage } from '../contexts/LanguageContext'; // 언어 훅 추가

import logoArArtroRobot from '../../img/ArtroRobot.png';
import logoDaehanTeck from '../../img/DAEHAN.png';
import logoRobostart from '../../img/RoboStart.png';
import logoSFA from '../../img/SFA.png';
import logoTheEngineer from '../../img/TheEngineer.png';
import { useTheme } from '../../hooks/useTheme'; // 테마 훅 추가

const StepFour = ({ onNext, onBack, data }) => {
  const { theme } = useTheme(); // 테마 사용
  const [selectedCompanies, setSelectedCompanies] = useState(data.company ? data.company.split(', ') : []);
  const { language } = useLanguage(); // 언어 상태 사용
  const [alertMessage, setAlertMessage] = useState('');

  // 회사 정보와 다국어 설명
  const companies = [
    { name: { KO: "Artro Robot", EN: "Artro Robot" }, logo: logoArArtroRobot, descriptions: { KO: "첨단 로봇 자동화 솔루션을 제공하는 회사입니다.", EN: "A company providing advanced robotic automation solutions." } },
    { name: { KO: "DAEHAN TECH CO. Ltd", EN: "DAEHAN TECH CO. Ltd" }, logo: logoDaehanTeck, descriptions: { KO: "다양한 산업용 기계와 장비를 제조합니다.", EN: "Manufactures various industrial machines and equipment." } },
    { name: { KO: "Robostar", EN: "Robostar" }, logo: logoRobostart, descriptions: { KO: "로봇 기술 스타트업으로 혁신적인 로봇 개발에 집중하고 있습니다.", EN: "A robotic technology startup focused on innovative robot development." } },
    { name: { KO: "SFA", EN: "SFA" }, logo: logoSFA, descriptions: { KO: "자동화 시스템 및 스마트 팩토리 솔루션을 제공합니다.", EN: "Provides automation systems and smart factory solutions." } },
    { name: { KO: "THE ENGINEER", EN: "THE ENGINEER" }, logo: logoTheEngineer, descriptions: { KO: "엔지니어링 문제 해결에 특화된 전문 기업입니다.", EN: "A specialized company focused on solving engineering problems." } },
    { name: { KO: "무관", EN: "ANY" }, logo: null, descriptions: { KO: "회사 선택이 무관하면 이 옵션을 선택하세요.", EN: "Select this option if the choice of company does not matter." } }
  ];


  const handleToggleCompany = (companyName) => {
    let newSelectedCompanies = [...selectedCompanies];
    if (companyName === '무관' || companyName === 'ANY') {
      if (newSelectedCompanies.includes('무관') || newSelectedCompanies.includes('ANY')) {
        newSelectedCompanies = []; // '무관' 또는 'ANY'가 선택되어 있다면 해제
        setAlertMessage('');
      } else {
        newSelectedCompanies = [companyName]; // '무관' 또는 'ANY' 선택 시 다른 선택 해제
        setAlertMessage(language === 'KO' ? '무관을 선택하면 다른 회사를 선택할 수 없습니다.' : 'If you select ANY, other companies cannot be selected.');
      }
    } else {
      if (newSelectedCompanies.includes('무관') || newSelectedCompanies.includes('ANY')) {
        setAlertMessage(language === 'KO' ? '다른 회사를 선택하려면 무관을 먼저 해제하세요.' : 'Deselect ANY to select other companies.');
      } else {
        if (newSelectedCompanies.includes(companyName)) {
          newSelectedCompanies = newSelectedCompanies.filter(c => c !== companyName);
          setAlertMessage('');
        } else if (newSelectedCompanies.length < 2) {
          newSelectedCompanies.push(companyName);
          setAlertMessage('');
        } else {
          setAlertMessage(language === 'KO' ? '최대 두 개의 회사를 선택할 수 있습니다.' : 'You can select up to two companies.');
        }
      }
    }
    setSelectedCompanies(newSelectedCompanies);
  };

  const handleNext = () => {
    onNext({ ...data, company: selectedCompanies.includes('무관') || selectedCompanies.includes('ANY') ? 'ALL' : selectedCompanies.join(', ') });
  };

  const [isChatVisible, setIsChatVisible] = useState(false);
  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-5xl font-extrabold text-center mb-12 ${theme === 'dark'
            ? 'text-white'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}>
          {language === 'KO' ? '회사 선택' : 'Select a Company'}
        </h2>
        {alertMessage && (
          <div className="text-center text-red-500 mb-4">
            {alertMessage}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {companies.map((company, index) => (
            <div
              key={index}
              onClick={() => handleToggleCompany(company.name[language])}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedCompanies.includes(company.name[language])
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xl'
                  : theme === 'dark'
                    ? 'bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white'
                    : 'bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800'
                } rounded-2xl overflow-hidden`}
            >
              <div className="p-8 flex flex-col items-center">
                {company.logo && <img src={company.logo} alt={`${company.name} Logo`} className="h-24 w-24 object-contain mb-6" />}
                <h3 className="font-bold text-2xl mb-4">{company.name[language]}</h3>
                <p className="text-center mb-6">{company.descriptions[language]}</p>
                <div className={`mt-auto font-semibold ${selectedCompanies.includes(company.name[language])
                    ? 'text-white'
                    : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                  {selectedCompanies.includes(company.name[language])
                    ? (language === 'KO' ? '선택됨' : 'SELECTED')
                    : (language === 'KO' ? '선택하려면 클릭하세요' : 'Click to select')}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className={`px-10 py-4 rounded-full transition duration-300 transform hover:-translate-y-1 hover:shadow-lg ${theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
          >
            {language === 'KO' ? '이전' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            {language === 'KO' ? '다음' : 'Next'}
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

export default StepFour;