import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { PencilAltIcon, MailIcon } from '@heroicons/react/outline';
import UserProfileSidebar from './UserProfileSidebar'; // 이 부분을 추가하세요.
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from './contexts/LanguageContext'

function UserProfile() {
    const [user, setUser] = useState({});
    const [editName, setEditName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { theme } = useTheme();
    const { language } = useLanguage();

    const text = {
        name: language === 'KO' ? '이름' : 'Name',
        email: language === 'KO' ? '이메일' : 'Email',
        save : language === 'KO' ? '변경사항 저장' : 'Save'
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('userToken');

        if (!userId) {
            alert("사용자 ID가 없습니다. 로그인 페이지로 이동합니다.");
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
                setEditName(response.data.userName);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, [navigate, id]); // useEffect 의존성 배열에 id 추가

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${id}`, {
                userName: editName,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            setUser({ ...user, userName: editName });
            setIsEditing(false);
            alert('사용자 정보가 수정되었습니다.');
            window.location.reload(); // 페이지 새로고침 추가
        } catch (error) {
            console.error('Error updating user info', error);
            alert('정보 업데이트 실패.');
        }
    };

    return (
        <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <UserProfileSidebar userId={id} />
            <div className="flex-grow p-5">
                <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'} shadow-lg rounded-lg p-12`}>
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-1">
                            {text.name}
                        </label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className={`shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline max-w-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-gray-800'}`}
                            disabled={!isEditing}
                        />
                        <button onClick={() => setIsEditing(!isEditing)} className="ml-4 text-blue-500 hover:text-blue-700">
                            <PencilAltIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-1">
                            {text.email}
                        </label>
                        <div className="flex items-center">
                            <MailIcon className="h-5 w-5 mr-2" />
                            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{user.userEmail}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-8">
                        <button onClick={handleSubmit} disabled={!isEditing || editName === user.userName} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-50">
                           {text.save}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;