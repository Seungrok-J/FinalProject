import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../api/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { useLanguage } from './contexts/LanguageContext';

function Login() {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { language } = useLanguage(); // 언어 상태와 전환 함수 가져오기

    // UI 텍스트를 현재 언어에 따라 결정하는 객체
    const text = {
        login: language === 'KO' ? '로그인' : 'Login',
        email: language === 'KO' ? '이메일' : 'Email',
        password: language === 'KO' ? '비밀번호' : 'Password',
        noAccount: language === 'KO' ? '계정이 없나요?' : 'Don’t have an account?',
        createAccount: language === 'KO' ? '계정 만들기' : 'Create Account',
        or: language === 'KO' ? '또는' : 'or',
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', { userEmail, password });
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userId', response.data.no);
            toast.success('로그인되었습니다.');  // 성공 메시지 표시
            setTimeout(() => {
                navigate('/');  // 홈으로 리디렉션
            }, 2000);  // 성공 메시지를 2초간 보여준 후 페이지 이동
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleLogout(); // 토큰 만료나 인증 실패 시 로그아웃
            } else {
                setError(`로그인 실패: ${error.response.data}`);
            }
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;
        console.log("credential", credential)
        try {
            const response = await api.post('/users/google-login', credential, {
                headers: { 'Content-Type': 'text/plain' }
            });
            console.log(response.data); // 전체 응답 데이터를 콘솔에 로그
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userId', response.data.no); // 'userId'를 저장
            toast.success('로그인되었습니다.');  // 성공 메시지 표시
            setTimeout(() => {
                navigate('/');  // 홈으로 리디렉션
            }, 2000);  // 성공 메시지를 2초간 보여준 후 페이지 이동
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleLogout(); // 토큰 만료나 인증 실패 시 로그아웃
            } else {
                console.error('API Error:', error);
                setError('구글 로그인 처리 중 오류 발생');
            }
        }
    };

    const handleGoogleLoginFailure = (error) => {
        console.error('구글 로그인 실패:', error);
        setError('구글 로그인 실패');
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        toast.info('세션이 만료되었습니다. 다시 로그인 해주세요.');
        navigate('/login');
    }


    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
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
                        {text.login}
                    </motion.h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {text.email}
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="youremail@example.com"
                                value={userEmail}
                                onChange={e => setUserEmail(e.target.value)}
                                required
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {text.password}
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
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
                            {text.login}
                        </motion.button>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                                    }`}></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                                    }`}>또는</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginFailure}
                                useOneTap
                                className="w-full"
                            />
                        </div>
                    </div>
                    <p className={`text-center text-sm mt-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {text.noAccount} <Link to="/register" className="text-blue-500 hover:underline font-medium">{text.createAccount}</Link>
                    </p>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            </motion.div>
        </GoogleOAuthProvider>
    );
}

export default Login;