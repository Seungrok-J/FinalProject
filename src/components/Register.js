import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguage } from './contexts/LanguageContext'

function Register() {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { language } = useLanguage();

    // UI 텍스트를 현재 언어에 따라 결정하는 객체
    const text = {
        register: language === 'KO' ? '회원가입' : 'Register',
        name: language === 'KO' ? '이름' : 'Name',
        email: language === 'KO' ? '이메일' : 'Email',
        ps: language === 'KO' ? '비밀번호' : 'Password',
        confirmPassword: language === 'KO' ? '비밀번호 확인' : 'Confirm Password',
        registerButton: language === 'KO' ? '가입하기' : 'Sign Up',
        alreadyAccount: language === 'KO' ? '이미 계정이 있나요?' : 'Already have an account?',
        login: language === 'KO' ? '로그인' : 'Login'
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }
        console.log({ userName, userEmail, password })
        // API 요청 로직
        try {
            const response = await api.post('/users/register', {
                userName, userEmail, password
            });
            console.log(response.data);
            toast.success('회원가입 성공! 로그인 페이지로 이동합니다.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error('회원가입 실패: ' + (error.response?.data || '오류 발생'));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-100 to-purple-100'
                }`}
        >
            <div className={`p-10 rounded-xl shadow-2xl max-w-md w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                <ToastContainer />
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className={`text-center text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}
                >
                    {text.register}
                </motion.h1>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{text.name}</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{text.email}</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="youremail@example.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{text.ps}</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{text.confirmPassword}</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="********"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                                : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
                    >
                        {text.registerButton}
                    </motion.button>
                </form>
                <p className={`text-center text-sm mt-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {text.alreadyAccount} <Link to="/login" className="text-blue-500 hover:underline font-medium">{text.login}</Link>
                </p>
            </div>
        </motion.div>
    );
}

export default Register;