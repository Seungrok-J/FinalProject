import React from 'react';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from '../hooks/useTheme'; // useTheme 훅 추가

const DxfViewerSites = () => {

    const { theme } = useTheme(); // useTheme 사용

    const sites = [
        { name: 'AutoCAD Web App', url: 'https://web.autocad.com', description: 'Free online access to AutoCAD' },
        { name: 'OnShape', url: 'https://www.onshape.com', description: 'Free, full-cloud 3D CAD system' },
        { name: 'LibreCAD Online', url: 'https://librecad.org', description: 'Open-source 2D CAD platform' },
        { name: 'DWG FastView', url: 'https://www.dwgfastview.com', description: 'Free online DWG viewer' },
    ];
    const { language } = useLanguage();

    const text = {
        explore: language === 'KO' ? '무료 DXF 뷰어 사이트 탐색' : 'Exploring free DXF viewer website',
    };

    return (
        <div>
            <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{text.explore}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sites.map((site, index) => (
                    <a key={index} href={site.url} target="_blank" rel="noopener noreferrer"
                        className={`flex flex-col items-start rounded-xl p-6 transition duration-300 ${theme === 'dark'
                                ? 'bg-gray-800 hover:bg-gray-700'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                        <div className={`flex items-center mb-3 text-lg font-semibold ${theme === 'dark'
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-800'
                            }`}>
                            <ExternalLinkIcon className="h-5 w-5 mr-2" />
                            {site.name}
                        </div>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{site.description}</p>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default DxfViewerSites;