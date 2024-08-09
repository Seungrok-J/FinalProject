// api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});


// 요청 인터셉터를 사용하여 Authorization 헤더 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const API_BASE_URL = 'http://localhost:8080/api'; // 스프링 부트 서버 주소

export const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/translate`, {
      text,
      targetLanguage
    });
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // 에러 발생 시 원본 텍스트 반환
  }
};

export default api;
