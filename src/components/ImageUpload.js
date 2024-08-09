import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { CloudUploadIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from './contexts/LanguageContext';
import api from '../api/api';
import Chatbot from './ChatbotModal';
import { ChatIcon } from '@heroicons/react/solid';
import LoadingModal from './LoadingModal';
import img1 from '../img/img1.jpeg'
import img2 from '../img/img2.jpeg'
import img3 from '../img/img3.jpeg'

function ImageUploadPage() {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [dimensions, setDimensions] = useState({ width: '', height: '', depth: '' });
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);

  const guideImages = [
    { src: img1, alt: "Measurement guide 1", dimensions: { width: 448, height: 538, depth: 4 } },
    { src: img2, alt: "Measurement guide 2", dimensions: { width: 538.5, height: 120, depth: 15 } },
    { src: img3, alt: "Measurement guide 3", dimensions: { width: 43.5, height: 43.5, depth: 40 } },
  ];

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const text = {
    title: language === 'KO' ? '이미지 업로드 및 치수 입력' : 'Image Upload and Dimensions',
    instruction: language === 'KO' ? '이미지를 드래그앤드랍하거나 클릭하여 업로드하세요.' : 'Drag and drop an image here, or click to select',
    upload: language === 'KO' ? '업로드' : 'Upload',
    processing: language === 'KO' ? '처리 중...' : 'Processing...',
    width: language === 'KO' ? '가로 (mm)' : 'Width (mm)',
    height: language === 'KO' ? '세로 (mm)' : 'Height (mm)',
    depth: language === 'KO' ? '두께 (mm)' : 'Depth (mm)',
    submit: language === 'KO' ? '견적 요청' : 'Request Estimate',
    loadingMessage: language === 'KO' ? '견적을 처리 중입니다...' : 'Processing your estimate...',
    measurementGuide: language === 'KO' ? '이미지 측정법' : 'Image Measurement Guide',
    close: language === 'KO' ? '닫기' : 'Close',
    backToUpload: language === 'KO' ? '이미지 다시 업로드' : 'Upload New Image',
  };

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    }
  });

  const handleUpload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowDimensions(true);
    }, 2000);
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoadingModalOpen(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', dimensions.width);
    formData.append('height', dimensions.height);
    formData.append('depth', dimensions.depth);

    try {
      const response = await api.post('/estimates', formData, {
        headers: {
          'Content-Type': undefined
        }
      });
      const { estimateIdx } = response.data;
      if (estimateIdx) {
        console.log(response.data);
        navigate(`/estimates/${estimateIdx}`, { state: { preview, dimensions } });
      } else {
        console.error("응답에서 견적 인덱스를 찾을 수 없습니다.");
        alert("서버 오류로 인해 견적 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("견적 제출 중 오류 발생:", error);
      alert("견적 제출에 실패했습니다.");
    } finally {
      setIsLoadingModalOpen(false);
    }
  };

  const nextGuideImage = () => {
    setCurrentGuideIndex((prevIndex) => (prevIndex + 1) % guideImages.length);
  };

  const prevGuideImage = () => {
    setCurrentGuideIndex((prevIndex) => (prevIndex - 1 + guideImages.length) % guideImages.length);
  };

  const resetToImageUpload = () => {
    setPreview(null);
    setFile(null);
    setShowDimensions(false);
    setDimensions({ width: '', height: '', depth: '' });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-5`}>
      <div className={`max-w-4xl mx-auto ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'} shadow-lg rounded-lg p-12`}>
        <h2 className="text-4xl font-bold mb-8">{text.title}</h2>
        {!showDimensions && (
          <>
            <div
              {...getRootProps()}
              className={`dropzone border-dashed border-2 rounded-lg p-16 text-center cursor-pointer transition duration-300 ease-in-out
                          ${isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}
                          ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <img src={preview} alt="Preview" className="mx-auto max-w-full max-h-[60vh] object-contain" />
              ) : (
                <>
                  <CloudUploadIcon className="mx-auto h-24 w-24 text-gray-400" />
                  <p className="mt-4 text-xl">{text.instruction}</p>
                </>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={!preview || isLoading}
              className={`mt-8 w-full bg-blue-500 text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 ease-in-out
                          ${!preview || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isLoading ? text.processing : text.upload}
            </button>
          </>
        )}
        {showDimensions && (
          <div className="mt-8">
            <button
              onClick={resetToImageUpload}
              className="mb-4 flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {text.backToUpload}
            </button>
            <button
              onClick={() => setShowMeasurementGuide(true)}
              className="mb-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              {text.measurementGuide}
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['width', 'height', 'depth'].map((dim) => (
                <div key={dim}>
                  <label htmlFor={dim} className="block mb-2 text-lg">{text[dim]}</label>
                  <input
                    type="number"
                    id={dim}
                    name={dim}
                    value={dimensions[dim]}
                    onChange={handleDimensionChange}
                    className={`w-full px-4 py-3 border rounded-lg text-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!dimensions.width || !dimensions.height || !dimensions.depth}
              className={`mt-8 w-full bg-green-500 text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 ease-in-out
                          ${(!dimensions.width || !dimensions.height || !dimensions.depth) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
            >
              {text.submit}
            </button>
          </div>
        )}
      </div>
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white hover:from-blue-600 hover:to-indigo-600 focus:outline-none shadow-lg transition duration-300 transform hover:scale-110"
        aria-label="Open chatbot"
      >
        <ChatIcon className="h-8 w-8" />
      </button>
      {isChatVisible && <Chatbot onClose={toggleChat} />}
      <LoadingModal isOpen={isLoadingModalOpen} message={text.loadingMessage} />

      {showMeasurementGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white p-8 rounded-lg max-w-3xl w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h3 className="text-2xl font-bold mb-6">{text.measurementGuide}</h3>
            <div className="relative">
              <img
                src={guideImages[currentGuideIndex].src}
                alt={guideImages[currentGuideIndex].alt}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded">
                {text.width}: {guideImages[currentGuideIndex].dimensions.width} mm<br />
                {text.height}: {guideImages[currentGuideIndex].dimensions.height} mm<br />
                {text.depth}: {guideImages[currentGuideIndex].dimensions.depth} mm
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={prevGuideImage}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextGuideImage}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300"
              >
                <ArrowRightIcon className="h-6 w-6" />
              </button>
            </div>
            <button
              onClick={() => setShowMeasurementGuide(false)}
              className="mt-6 w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            >
              {text.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploadPage;