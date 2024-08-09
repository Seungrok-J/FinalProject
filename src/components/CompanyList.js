import React from 'react';
import { ExternalLinkIcon, OfficeBuildingIcon } from '@heroicons/react/outline';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from '../hooks/useTheme';

const CompanyList = () => {
    const { theme } = useTheme();
    const { language } = useLanguage();

    const companies = [
        {
            name: language === 'KO' ? '디엔지니어' : 'The Engineer',
            url: 'https://theengineer.modoo.at/',
            description: language === 'KO' ? '엔지니어링 및 설계 서비스' : 'Engineering and Design Services'
        },
        {
            name: language === 'KO' ? '한에프에스' : 'HanFS',
            url: 'http://www.xn--9t4b11da186msma.com/default/mp2/mp2_sub2.php?sub=02',
            description: language === 'KO' ? '금속 및 플라스틱 제조' : 'Metal and Plastic Manufacturing'
        },
        {
            name: language === 'KO' ? '파트론' : 'Partron',
            url: 'http://www.partron.co.kr/',
            description: language === 'KO' ? '전자 부품 및 센서 제조' : 'Electronics Components and Sensors Manufacturing'
        },
        {
            name: language === 'KO' ? '케이엠테크' : 'KMTech',
            url: 'http://www.kmtc21.com/htm/main.htm',
            description: language === 'KO' ? '정밀 기계 부품 생산' : 'Precision Machinery Parts Production'
        },
        {
            name: language === 'KO' ? '새한산업' : 'Saehan Industry',
            url: 'http://www.saehani.com/index.html',
            description: language === 'KO' ? '자동차 및 산업기계 부품' : 'Automotive and Industrial Machinery Parts'
        },
        {
            name: language === 'KO' ? '동우기계' : 'Dongwoo Machinery',
            url: 'http://www.dwdth.com/',
            description: language === 'KO' ? 'CNC 및 기계 가공' : 'CNC and Machine Processing'
        },
        {
            name: language === 'KO' ? '우성기계' : 'Woosung Machinery',
            url: 'http://woosungmc.kr/',
            description: language === 'KO' ? '일반 및 정밀 가공 서비스' : 'General and Precision Processing Services'
        }
    ];

    const text = {
        list: language === 'KO' ? '의뢰 가능한 제조업체 목록' : 'List of Manufactures'
    };

    return (
        <div>
            <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{text.list}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {companies.map((company, index) => (
                    <div key={index} className={`flex flex-col rounded-xl p-6 transition duration-300 ${theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}>
                        <a href={company.url} target="_blank" rel="noopener noreferrer"
                            className={`flex items-center mb-3 text-lg font-semibold ${theme === 'dark'
                                    ? 'text-blue-400 hover:text-blue-300'
                                    : 'text-blue-600 hover:text-blue-800'
                                }`}>
                            <OfficeBuildingIcon className="h-5 w-5 mr-2" />
                            {company.name}
                            <ExternalLinkIcon className="h-5 w-5 ml-1" />
                        </a>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{company.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyList;