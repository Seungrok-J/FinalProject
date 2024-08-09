import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircleIcon, LogoutIcon, ChatIcon, MoonIcon, SunIcon, GlobeAltIcon } from '@heroicons/react/outline';
import { useTheme } from '../hooks/useTheme';
import api, { translateText } from '../api/api';
import useOutsideClick from '../hooks/useOutsideClick';
import { useLanguage } from './contexts/LanguageContext';


const Nav = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isLoggedIn = !!localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    const [user, setUser] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    // Create a ref for the dropdown element
    const dropdownRef = useRef(null);
    const [loginButtonText, setLoginButtonText] = useState('로그인');

    // 번역 함수 호출
    // 언어 토글 버튼에 대한 이벤트 핸들러 수정
    const handleLanguageToggle = async () => {
        const targetLang = language === 'KO' ? 'en' : 'ko'; // 목표 언어 설정
        const translatedText = await translateText('로그인', targetLang); // 번역 요청
        setLoginButtonText(translatedText); // 번역된 텍스트로 상태 업데이트
        toggleLanguage(); // 언어 상태 토글
    };

    // Use the useOutsideClick hook
    useOutsideClick(dropdownRef, () => {
        if (dropdownOpen) setDropdownOpen(false);
    });

    const fetchUser = useCallback(async () => {
        if (isLoggedIn) {
            try {
                const response = await api.get(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                setUser(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    handleLogout();
                    alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
                }
            }
        }
    }, [isLoggedIn, userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        alert('로그아웃되었습니다');
        navigate('/');
    };



    return (
        <nav className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4 shadow-md transition-colors duration-300`}>
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold hover:text-blue-500 transition-colors">
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        SFac Solution
                    </motion.span>
                </Link>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                    </button>
                    <button
                        onClick={handleLanguageToggle}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Switch Language"
                    >
                        <GlobeAltIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                        <span className="sr-only">{language === 'KO' ? 'Switch to English' : '한국어로 변경'}</span>
                    </button>
                    {isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                                aria-haspopup="true"
                                aria-expanded={dropdownOpen}
                            >
                                <UserCircleIcon className="h-6 w-6 mr-2" />
                                <span className="hidden md:inline">{user.userName}</span>
                            </button>
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className={`absolute right-0 mt-2 py-2 w-48 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg shadow-xl z-50`}
                                    >
                                        <p className="block px-4 py-2 text-sm">{user.userName}</p>
                                        <p className="block px-4 py-2 text-sm">{user.userEmail}</p>
                                        <Link to={`/user/${userId}`} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Your profile</Link>
                                        <Link to={`/chat/${userId}`} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <ChatIcon className="h-4 w-4 mr-2" />
                                            ChatBot Service
                                        </Link>
                                        <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <LogoutIcon className="h-4 w-4 mr-2" />
                                            Log out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm shadow transition-colors">
                            {loginButtonText}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;