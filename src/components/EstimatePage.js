import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from './contexts/LanguageContext';
import api from '../api/api';
import CompanyList from './CompanyList';
import Chatbot from './ChatbotModal';
import { ChatIcon } from '@heroicons/react/solid';
import { FaInfoCircle, FaClipboardList, FaTools } from 'react-icons/fa';

function EstimatePage() {
    const [estimatedValue, setEstimatedValue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { estimateIdx } = useParams();
    const { theme } = useTheme();
    const { language } = useLanguage();
    const [isChatVisible, setIsChatVisible] = useState(false);
    const toggleChat = () => {
        setIsChatVisible(!isChatVisible);
      };

    const text = {
        title: language === 'KO' ? '예상 견적' : 'Estimated Quote',
        loading: language === 'KO' ? '견적을 불러오는 중...' : 'Loading estimate...',
        error: language === 'KO' ? '견적을 불러오는 데 실패했습니다.' : 'Failed to load estimate.',
        estimatedCost: language === 'KO' ? '예상 비용' : 'Estimated Cost',
        disclaimer: language === 'KO' ? '견적 유의사항' : 'Estimate Disclaimer',
        disclaimerText: language === 'KO'
            ? '본 견적서는 다음 사항들로 인해 오차가 발생할 수 있습니다:\n- 가공업체 및 공급업체\n- 후처리 과정'
            : 'This estimate may vary due to:\n- Manufacturing and supply companies\n- Post-processing procedures',
    };

    useEffect(() => {
        const fetchEstimate = async () => {
            try {
                const response = await api.get(`/estimates/${estimateIdx}`);
                setEstimatedValue(Math.round(response.data.estimatedValue / 100) * 100);
            } catch (error) {
                console.error('Error fetching estimate:', error);
                alert(text.error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEstimate();
    }, [estimateIdx, text.error]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen text-xl font-semibold">{text.loading}</div>;
    }

    if (estimatedValue === null) {
        return <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-red-500">{text.error}</div>;
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="container mx-auto p-8">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 mb-8 transition-all duration-300 hover:shadow-2xl`}>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                        <FaClipboardList className="mr-3" />
                        {text.title}
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center">
                                <FaTools className="mr-2" />
                                {text.estimatedCost}
                            </h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {new Intl.NumberFormat(language === 'KO' ? 'ko-KR' : 'en-US', {
                                    style: 'currency',
                                    currency: language === 'KO' ? 'KRW' : 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(estimatedValue)}
                            </p>
                        </div>
                        <div className="relative group">
                            <FaInfoCircle className="text-2xl text-yellow-500 cursor-help" />
                            <div className="absolute right-0 w-64 p-4 mt-2 text-sm bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                                <h4 className="font-bold mb-2">{text.disclaimer}</h4>
                                <p className="whitespace-pre-line">{text.disclaimerText}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`rounded-lg shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="p-8">
                        <CompanyList />
                    </div>
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
}

export default EstimatePage;