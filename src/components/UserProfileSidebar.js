import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { UserIcon, DocumentIcon, TrashIcon } from '@heroicons/react/outline';

const UserProfileSidebar = ({ userId }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { theme } = useTheme();

    const handleDelete = async () => {
        if (window.confirm('정말로 계정을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                });
                localStorage.removeItem('userToken');
                localStorage.removeItem('userId');
                navigate('/login');
                alert('계정이 삭제되었습니다.');
            } catch (error) {
                console.error('Error deleting account', error);
                alert('계정 삭제 실패.');
            }
        }
    };

    return (
        <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-64 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-6`}
        >
            <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>SETTINGS</h2>
            <ul className="space-y-4">
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link to={`/user/${userId}`} className={`flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition duration-300`}>
                        <UserIcon className="h-5 w-5 mr-2" />
                        Your Profile
                    </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link to={`/user/${userId}/designs`} className={`flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition duration-300`}>
                        <DocumentIcon className="h-5 w-5 mr-2" />
                        My Blueprint
                    </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button 
                        className={`flex items-center ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition duration-300`}
                        onClick={handleDelete}
                    >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Delete Account
                    </button>
                </motion.li>
            </ul>
        </motion.div>
    );
};

export default UserProfileSidebar;