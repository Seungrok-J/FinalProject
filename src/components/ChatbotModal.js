import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatbotModal = ({ onClose }) => {
    const [isComposing, setIsComposing] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    // 메시지를 OpenAI에 보내고 응답을 받는 부분
    

    const handleSendMessage = () => {
        if (!input.trim()) return;  // 입력값이 없으면 반환

        const userMessage = { role: 'user', content: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);  // 현재 메시지 배열에 사용자 메시지 추가
        setInput('');  // 입력 필드 초기화
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();  // 기본 'Enter' 키 이벤트 방지
            handleSendMessage();  // 메시지 전송 함수 호출
        }
    };

    const formatMessage = (message) => {
        const boldRegex = /\*\*(.*?)\*\*/g; // Bold markdown detection regex
        const headerRegex = /^(#+)\s*(.*)$/gm; // Header markdown detection regex

        let formattedMessage = message.replace(boldRegex, "<strong>$1</strong>"); // Replace bold with <strong>

        // Replace header markdown with appropriate <h?> tags
        formattedMessage = formattedMessage.replace(headerRegex, (match, hashes, text) => {
            const level = hashes.length; // Determine header level by number of #
            return `<h${level}>${text}</h${level}>`; // Example: "### Header" -> <h3>Header</h3>
        });

        // Split by newline and wrap each line in <p> tags
        return formattedMessage.split('\n').map((line, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>
        ));
    };

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-white rounded-2xl shadow-2xl max-w-sm w-full md:max-w-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Mini GPT</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="mb-4 overflow-y-auto h-48 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            {/* 메시지 포맷팅 함수를 여기에 적용 */}
                            {formatMessage(msg.content)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent px-4 py-2 text-gray-700 focus:outline-none"
                    placeholder="Type your message..."
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatbotModal;