import React, { useState } from 'react';
import { ChatIcon } from '@heroicons/react/solid';
import Chatbot from '../ChatbotModal';
import { useTheme } from '../../hooks/useTheme'; // 테마 훅 추가
import { useLanguage } from '../contexts/LanguageContext'; // 언어 훅 추가

const StepThree = ({ onNext, onBack, data }) => {
  const [selectedMaterials, setSelectedMaterials] = useState(data.materials || []);
  const { theme } = useTheme(); // 테마 사용
  const { language } = useLanguage(); // 언어 상태 사용
  const [alertMessage, setAlertMessage] = useState('');

  // 재료 정보와 다국어 설명
  const materialsInfo = [
    { name: "Structural Steels", descriptions: { KO: "구조용 강철은 건축 및 기타 구조물에 사용됩니다.", EN: "Structural steel is used in construction and other structures." } },
    { name: "Aluminum Alloys", descriptions: { KO: "알루미늄 합금은 항공 및 자동차 산업에 이상적입니다.", EN: "Aluminum alloys are ideal for the aerospace and automotive industries." } },
    { name: "Carbon Steels", descriptions: { KO: "탄소강은 다양한 산업용 제품에 사용됩니다.", EN: "Carbon steel is used in a variety of industrial products." } },
    { name: "Stainless Steels", descriptions: { KO: "스테인리스강은 부식에 강한 특성을 가지고 있습니다.", EN: "Stainless steel is characterized by its resistance to corrosion." } },
    { name: "ESD PC", descriptions: { KO: "정전기 방지 폴리카보네이트는 전자 제품 케이싱에 사용됩니다.", EN: "Electrostatic Discharge Polycarbonate is used for electronic product casings." } },
    { name: "MC Nylon", descriptions: { KO: "MC 나일론은 기어 및 베어링 제작에 사용됩니다.", EN: "MC Nylon is used for making gears and bearings." } },
    { name: "Polyurethane", descriptions: { KO: "폴리우레탄은 발포 제품 및 코팅에 사용됩니다.", EN: "Polyurethane is used in foam products and coatings." } },
    { name: "Composite Materials", descriptions: { KO: "복합 재료는 두 가지 이상의 재료로 만들어집니다.", EN: "Composite materials are made from two or more materials." } },
    { name: "Teflon", descriptions: { KO: "테프론은 논스틱 코팅과 요리 용구에 사용됩니다.", EN: "Teflon is used in non-stick coatings and cookware." } },
    { name: "Polycarbonate", descriptions: { KO: "폴리카보네이트는 충격에 강하며 안전 유리 및 안경에 사용됩니다.", EN: "Polycarbonate is impact resistant and used in safety glasses and eyewear." } },
    { name: "Urethane", descriptions: { KO: "우레탄은 접착제 및 씰링제에 사용됩니다.", EN: "Urethane is used in adhesives and sealants." } },
    { name: "무관", descriptions: { KO: "모든 재료가 가능합니다.", EN: "Any material is acceptable." } }
  ];

  const handleToggleMaterial = (materialName) => {
    let newMaterials = [...selectedMaterials];
    if (materialName === 'etc' || materialName === '무관') {
      if (newMaterials.includes(materialName)) {
        newMaterials = []; // If 'etc' or '무관' is already selected, deselect it
        setAlertMessage('');
      } else {
        newMaterials = [materialName]; // Select only 'etc' or '무관'
        setAlertMessage(language === 'KO' ? `${materialName}를 선택하면 다른 재료는 선택할 수 없습니다.` : `If you select ${materialName}, other materials cannot be selected.`);
      }
    } else {
      if (newMaterials.includes('etc') || newMaterials.includes('무관')) {
        setAlertMessage(language === 'KO' ? '다른 재료를 선택하려면 기타 또는 무관을 먼저 해제하세요.' : 'Deselect etc or 무관 to select other materials.');
      } else {
        if (newMaterials.includes(materialName)) {
          newMaterials = newMaterials.filter(m => m !== materialName);
          setAlertMessage('');
        } else if (newMaterials.length < 3) {
          newMaterials.push(materialName);
          setAlertMessage('');
        }
      }
    }
    setSelectedMaterials(newMaterials);
  };

  const handleNext = () => {
    onNext({ ...data, materials: selectedMaterials.includes('무관') ? ['ALL'] : selectedMaterials });
  };

  const [isChatVisible, setIsChatVisible] = useState(false);
  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} min-h-screen py-16 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          {language === 'KO' ? '재료 선택 (최대 3개)' : 'Select Materials (up to 3)'}
        </h2>
        {alertMessage && (
          <div className="text-center text-red-500 mb-4">
            {alertMessage}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {materialsInfo.map((material, index) => (
            <div
              key={index}
              onClick={() => handleToggleMaterial(material.name)}
              className={`cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${
                selectedMaterials.includes(material.name)
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xl'
                  : 'bg-white bg-opacity-60 hover:bg-opacity-100 text-gray-800'
              } ${selectedMaterials.length >= 3 && !selectedMaterials.includes(material.name) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="font-bold text-lg mb-3">{material.name}</span>
              <p className="text-sm">{material.descriptions[language]}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-10 py-4 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
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

export default StepThree;