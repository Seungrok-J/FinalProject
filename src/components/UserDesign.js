import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { DocumentDownloadIcon, TrashIcon } from '@heroicons/react/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import UserProfileSidebar from './UserProfileSidebar';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './contexts/LanguageContext';

function UserDesigns() {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageGroup, setPageGroup] = useState(0); // 페이지 그룹 관리
    const navigate = useNavigate();
    const userNo = localStorage.getItem('userId');
    const { id } = useParams();
    const itemsPerPage = 4;
    const { theme } = useTheme();
    const { language } = useLanguage();

    const text = {
        delete: language === 'KO' ? '삭제' : 'DELETE',
        downloadFile: language === 'KO' ? '다운로드' : 'Download File',
        budget: language === 'KO' ? '예상 견적' : 'Estimated Cost',
        company: language === 'KO' ? '회사' : 'Company',
        material: language === 'KO' ? '사용 재료' : 'Material',
        myBlueprint: language === 'KO' ? '내 도면' : 'My Blueprints',
        loading: language === 'KO' ? '로딩 중...' : 'Loading...',
        deleteConfirm: language === 'KO' ? '정말로 이 도면을 삭제하시겠습니까?' : 'Are you sure you want to delete this design?',
        deleteSuccess: language === 'KO' ? '도면이 삭제되었습니다.' : 'The design has been deleted.',
        deleteFailed: language === 'KO' ? '도면 삭제에 실패하였습니다.' : 'Failed to delete the design.',
        deleteError: language === 'KO' ? '도면 삭제 중 오류가 발생했습니다.' : 'An error occurred while deleting the design.',
    };

    useEffect(() => {
        if (!userNo) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        fetchDesigns();
    }, [navigate, userNo, currentPage, itemsPerPage]);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/services/by-user/${userNo}?page=${currentPage - 1}&limit=${itemsPerPage}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            });
            setDesigns(response.data.designs);
            setTotalPages(response.data.totalPages);
            console.log("Fetched designs:", response.data.designs); // 데이터 구조 로깅
        } catch (error) {
            console.error("도면 정보를 가져오는 중 오류가 발생했습니다:", error);
        } finally {
            setLoading(false);
        }
    };

    // 도면을 삭제하는 함수
    const deleteDesign = async (designId) => {
        if (window.confirm(text.deleteConfirm)) {
            try {
                setLoading(true);
                const response = await api.delete(`/services/by-user/${userNo}/${designId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                if (response.status === 200) {
                    let newDesigns = designs.filter(design => design.serviceIdx !== designId);
                    setDesigns(newDesigns);
                    alert(text.deleteSuccess);

                    // 삭제 후 항목이 페이지에 없을 경우 페이지를 갱신하거나, 데이터를 다시 불러옵니다.
                    if (newDesigns.length === 0) {
                        if (currentPage > 1) {
                            setCurrentPage(currentPage - 1); // 이전 페이지로 이동
                        } else {
                            fetchDesigns(); // 첫 페이지 데이터 다시 불러오기
                        }
                    } else if (newDesigns.length < itemsPerPage && currentPage < totalPages) {
                        fetchDesigns(); // 현재 페이지 데이터를 다시 불러와서 채우기
                    }
                } else {
                    alert(text.deleteFailed);
                }
            } catch (error) {
                console.error(text.deleteError, error);
                alert(text.deleteError);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleNextGroup = () => {
        setPageGroup(pageGroup + 1);
    };

    const handlePreviousGroup = () => {
        setPageGroup(pageGroup - 1);
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const groupedPageNumbers = pageNumbers.slice(pageGroup * 10, (pageGroup + 1) * 10);

    return (
        <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <UserProfileSidebar userId={id} />
            <div className="flex-grow p-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-8`}
                >
                    {loading ? (
                        <div className="text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto"
                            />
                            <p className="mt-4">{text.loading}</p>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-3xl font-bold mb-6">{text.myBlueprint}</h1>
                            <AnimatePresence>
                                {designs.map((design, index) => (
                                    <motion.div
                                        key={design.serviceIdx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`mb-4 p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg shadow-md flex justify-between items-center`}
                                    >
                                        <div>
                                            <h2 className="text-xl font-semibold mb-2">{design.title}</h2>
                                            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {text.budget}: {design.budget > 0 ? `₩${design.budget.toLocaleString()}` : '-'}
                                            </p>
                                            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{text.material}: {design.materials}</p>
                                            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{text.company}: {design.company}</p>
                                            <a href={design.filePath} download className="flex items-center text-blue-500 hover:text-blue-400 mt-2 transition duration-300">
                                                <DocumentDownloadIcon className="h-5 w-5 mr-2" />
                                                {text.downloadFile}
                                            </a>
                                        </div>
                                        <button onClick={() => deleteDesign(design.serviceIdx)} className="flex items-center text-red-500 hover:text-red-400 transition duration-300">
                                            <TrashIcon className="h-5 w-5 mr-2" />
                                            {text.delete}
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div className="flex justify-center space-x-2 mt-6">
                                {pageGroup > 0 && (
                                    <motion.button
                                        onClick={handlePreviousGroup}
                                        className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'} hover:bg-blue-500 hover:text-white transition duration-300`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </motion.button>
                                )}
                                {groupedPageNumbers.map(page => (
                                    <motion.button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-lg ${page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : `${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'}`}
                                        hover:bg-blue-500 hover:text-white transition duration-300`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {page}
                                    </motion.button>
                                ))}
                                {(pageGroup + 1) * 10 < totalPages && (
                                    <motion.button
                                        onClick={handleNextGroup}
                                        className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'} hover:bg-blue-500 hover:text-white transition duration-300`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default UserDesigns;