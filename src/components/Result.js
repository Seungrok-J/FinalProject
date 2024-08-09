import React from 'react';
import { useLocation } from 'react-router-dom';
import { DownloadIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import DxfViewerSites from './DxfViewerSites';
import CompanyList from './CompanyList';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from '../hooks/useTheme'; // useTheme 훅 추가

const ResultPage = () => {
    const { language } = useLanguage();
    const { theme } = useTheme(); // useTheme 사용
    const location = useLocation();
    const filesInfo = location.state ? location.state.filesInfo : [];

    const text = {
        title: language === 'KO' ? '도면 및 예산' : 'Blueprints and Budgets',
        subtitle: language === 'KO' ? '제조 솔루션 탐색' : 'Explore Manufacturing Solutions',
        noFiles: language === 'KO' ? '표시할 파일이 없습니다' : 'No files to display',
        moreInfo: language === 'KO' ? '더 많은 정보가 필요하신가요?' : 'Need more information?',
        learnMore: language === 'KO' ? '자세히 알아보기' : 'Learn More',
        downloadFile: language === 'KO' ? '파일 다운로드' : 'Download File',
        budget : language === 'KO' ? '예상 견적' : 'Estimated Cost',
        company : language === 'KO' ? '회사' : 'Company',
        material : language === 'KO' ? '사용 재료' : 'Material',
    }

    return (
        <div className={`min-h-screen py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="container mx-auto px-4">
                <h1 className={`text-5xl font-extrabold text-center mb-10 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {text.title}<br/>
                    <span className={`${theme === 'dark' ? 'text-blue-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                        {text.subtitle}
                    </span>
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {filesInfo.length > 0 ? (
                        filesInfo.map((file, index) => (
                            <div key={index} className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="p-8">
                                    <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{file.title || text.noTitleAvailable}</h3>
                                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {text.budget}: <span className="font-semibold text-green-600 text-xl">
                                            {file.budget > 0 ? `₩${file.budget.toLocaleString()}` : '-'}
                                        </span>
                                    </p>
                                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{text.company}: <span className="font-semibold">{file.company}</span></p>
                                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{text.material}: <span className="font-semibold">{file.materials}</span></p>
                                    <a href={file.filePath} download className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-md hover:shadow-lg">
                                        <DownloadIcon className="h-5 w-5 mr-2" />
                                        {text.downloadFile}
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={`text-center col-span-2 p-8 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'}`}>{text.noFiles}</p>
                    )}
                </div>

                <div className={`rounded-3xl shadow-xl overflow-hidden mb-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="p-8 space-y-12">
                        <DxfViewerSites />
                        <CompanyList />
                    </div>
                </div>
                
                <div className="text-center">
                    <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{text.moreInfo}</h2>
                    <a href="https://www.google.com/" className={`inline-flex items-center px-8 py-4 rounded-full transition duration-300 text-lg font-semibold shadow-lg hover:shadow-xl ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                        {text.learnMore}
                        <ExternalLinkIcon className="h-5 w-5 ml-2" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;