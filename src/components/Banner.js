import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../img/banner.jpg';
import { useLanguage } from './contexts/LanguageContext';

const Banner = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId = localStorage.getItem('userId');
  const { language } = useLanguage();
  console.log(localStorage)

  const text = {
    blueprintRecommendation: language === 'KO' ? '도면 추천 받기' : 'Get Blueprint Recommendations',
    aiInteraction: language === 'KO' ? 'AI 챗봇 서비스 이용하기' : 'Use AI ChatBot Service',
    servicePreparation: language === 'KO' ? '예상 견적 제공 받기' : 'Receive a Preliminary Estimate',
    blueprintDesc: language === 'KO' ? 'AI를 통해 최적의 도면을 추천받아보세요' : 'Get the best blueprint recommendations via AI',
    chatDesc: language === 'KO' ? 'AI와 대화하며 아이디어를 발전시켜보세요' : 'Develop your ideas by chatting with AI',
    comingSoon: language === 'KO' ? 'AI를 통해 도면의 예상 견적을 제공받아보세요' : 'Receive a Preliminary Estimate for the Blueprint via AI'
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  const handleNavigation = (path) => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={bannerImage}
        alt="Banner"
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent flex items-center justify-center">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 h-4/5">
          <button
            onClick={() => handleNavigation('/BlueprintPage/')}
            className="flex-1 bg-white bg-opacity-10 backdrop-blur-sm text-white border border-white border-opacity-30 font-bold rounded-3xl shadow-2xl transition duration-300 ease-in-out hover:bg-opacity-20 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex flex-col justify-center items-center p-8"
          >
            <h2 className="text-4xl mb-6">{text.blueprintRecommendation}</h2>
            <p className="text-xl opacity-80">{text.blueprintDesc}</p>
          </button>
          <div className="flex flex-col gap-8 flex-1">
            <button
              onClick={() => handleNavigation(`/chat/${userId}`)}
              className="flex-1 bg-white bg-opacity-10 backdrop-blur-sm text-white border border-white border-opacity-30 font-bold rounded-3xl shadow-2xl transition duration-300 ease-in-out hover:bg-opacity-20 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex flex-col justify-center items-center p-8"
            >
              <h3 className="text-3xl mb-4">{text.aiInteraction}</h3>
              <p className="text-lg opacity-80">{text.chatDesc}</p>
            </button>
            <button
              onClick={() => handleNavigation(`/image/${userId}`)}
              className="flex-1 bg-white bg-opacity-10 backdrop-blur-sm text-white border border-white border-opacity-30 font-bold rounded-3xl shadow-2xl transition duration-300 ease-in-out hover:bg-opacity-20 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex flex-col justify-center items-center p-8"
            >
              <h3 className="text-3xl mb-4">{text.servicePreparation}</h3>
              <p className="text-lg opacity-80">{text.comingSoon}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;