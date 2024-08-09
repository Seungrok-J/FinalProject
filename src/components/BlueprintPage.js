import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepOne from './steps/StepOne';
import StepThree from './steps/StepThree';
import StepFour from './steps/StepFour';
import StepFive from './steps/StepFive';
import api from '../api/api';
import { useLanguage } from './contexts/LanguageContext'; // useLanguage 훅 추가
import { useTheme } from '../hooks/useTheme'; // useTheme 훅 추가

const BlueprintPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage(); // useLanguage 사용
  const { theme } = useTheme(); // useTheme 사용
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    detailed: '',
    company: '',
    materials: [],
    details: ''
  });

  const [loading, setLoading] = useState(false);

  const handleNext = data => {
    setFormData(prevData => ({ ...prevData, ...data }));
    // StepOne에서 전달받은 값을 사용하여 currentStep 설정
    if (currentStep === 1) {
      setCurrentStep(data.detailed === 'Assembly' ? 3 : 2);
    } else {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 3 && formData.detailed === 'Assembly') {
      setCurrentStep(1); // Assembly 선택 시 StepFour에서 StepOne으로 이동
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const companies = Array.isArray(formData.company) ? formData.company : formData.company.split(',').map(item => item.trim());
    const updatedFormData = {
      ...formData,
      company: companies
    };

    setLoading(true);

    try {
      const response = await api.post('/blueprints/submit', updatedFormData);
      console.log('Response from server:', response.data);

      if (response.data && response.data.length > 0) {
        const filesInfo = response.data.map(item => ({
          cadDataId: item.id,
          filePath: `https://sfacsolution.s3.ap-northeast-2.amazonaws.com/CAD_indexUpper/${encodeURIComponent(item.id)}.dxf`,
          title: item.title,
          budget: item.budget,
          detail: item.detail,
          materials: item.materials,
          company: item.company
        }));

        // 사용자 ID 가져오기 (예시: 로그인 상태 정보로부터)
        const userId = localStorage.getItem('userId');

        // 사용자 번호 조회 및 서비스 데이터 저장
        if (userId) {
          const userResponse = await api.get(`/users/${userId}`);
          console.log(userResponse)
          if (userResponse.data) {
            const userNo = userResponse.data.no;
            filesInfo.forEach(async fileInfo => {
              await api.post('/services/register', { userNo, ...fileInfo });
            });
          }
        }
        navigate('/Result', { state: { filesInfo } });
      } else {
        console.error('No results or invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to submit blueprint:', error);
    } finally {
      setLoading(false);
    }
  };

  const text = {
    processing: language === 'KO' ? 'Processing...' : 'Processing...',
    pleaseWait: language === 'KO' ? 'Please wait a moment' : 'Please wait a moment'
  };

  if (loading) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 bg-opacity-50' : 'bg-white bg-opacity-50'} backdrop-blur-sm z-50`}>
        <div className={`rounded-lg p-8 shadow-2xl flex flex-col items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`mt-4 text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>{text.processing}</div>
          <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{text.pleaseWait}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentStep === 1 && <StepOne onNext={handleNext} onSetCurrentStep={setCurrentStep} currentStep={currentStep} data={formData} />}
      {currentStep === 2 && <StepThree onNext={handleNext} onBack={handleBack} data={formData} />}
      {currentStep === 3 && <StepFour onNext={handleNext} onBack={handleBack} data={formData} />}
      {currentStep === 4 && <StepFive onBack={handleBack} onSubmit={handleSubmit} data={formData} setData={setFormData} />}
    </div>
  );
};

export default BlueprintPage;