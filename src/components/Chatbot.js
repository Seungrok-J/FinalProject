import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, PaperAirplaneIcon } from '@heroicons/react/solid';
import { useTheme } from '../hooks/useTheme';  // 테마 훅을 추가
import { useLanguage } from './contexts/LanguageContext';

const Chatbot = () => {
  const [isComposing, setIsComposing] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomTitle, setSelectedRoomTitle] = useState(''); // 선택된 채팅방 제목 상태
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [showRooms, setShowRooms] = useState(true);  // 채팅방 목록 표시 상태
  const navigate = useNavigate();
  const { theme } = useTheme();  // 테마 상태 사용
  const { language } = useLanguage();

  const text = {
    chatbot: language === 'KO' ? '인공지능 챗봇' : 'AI Chatbot',
    chatroomlist: language === 'KO' ? '채팅방 목록' : 'Chat Room List',
    chatinput: language === 'KO' ? '채팅방 이름 입력' : 'Enter Chat Room Name',
    chatcreate: language === 'KO' ? '채팅방 생성' : 'Create Chat Room',
    messageinput: language === 'KO' ? '메세지 입력' : 'Enter Message', // Corrected from '채티방 생성' to '메세지 입력' for 'Enter Message' 
    nomessage: language === 'KO' ? '메세지가 없습니다.' : 'No messages',
    loading : language ==='KO' ? '답변을 기다리고 있습니다....' : 'Waiting for Answer....'
  }

  const toggleRooms = () => {
    setShowRooms(!showRooms);  // 채팅방 목록 표시 상태 토글
  };

  const messagesContainerRef = useRef(null);  // 메시지 컨테이너에 대한 ref 생성

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // JWT 토큰을 로컬 스토리지에서 가져오기
  const token = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');
  if (!token) {
    alert("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
    navigate('/login');
  }

  const fetchRooms = async () => {
    try {
      const response = await api.get(`/chat/rooms/userno/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomTitle || !userId) return; // userId가 없으면 함수를 종료

    try {
      const response = await api.post('/chat/rooms', {
        title: roomTitle,
        userId: userId  // 채팅방 생성 요청에 userId 포함
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoomTitle('');
      fetchRooms();  // 채팅방 목록을 새로고침
      setRooms(prevRooms => [response.data, ...prevRooms]);  // 새 방을 목록 앞에 추가
      console.log(response)
    } catch (error) {
      console.error('Failed to create room', error);
    }
  };




  const handleSendMessage = async () => {
    if (!userInput.trim() || !selectedRoom) {
      alert("채팅방을 먼저 생성해 주세요.");
      return;
    }

    const message = userInput.trim();
    setUserInput('');  // 입력 필드 초기화
    setLoading(true);

    const newUserMessage = {
      sender: 'user',
      content: message
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    scrollToBottom(); // Ensure the latest message is visible

    try {
      // 서버 엔드포인트에 메시지 전송 및 GPT 응답 받기
      const response = await api.post(`/chat/process/${selectedRoom.id}`, {
        inputMessage: message
      });
      console.log(response)
      // 서버로부터 응답을 받고, 상태 업데이트
      // if (response.data) {
      //   setMessages(prevMessages => [
      //     ...prevMessages,
      //     {
      //       sender: 'user',
      //       inputMessage: message, // 사용자가 입력한 메시지
      //       //responseMessage: ''    // 사용자 메시지에 대한 응답은 아직 없음
      //       content: ''
      //     },
      //     {
      //       sender: 'bot',
      //       inputMessage: '',      // 봇의 응답에 대한 입력 메시지는 없음
      //       //responseMessage: response.data.responseMessage // 봇의 응답 메시지
      //       content: response.data.content
      //     }
      //   ]);
      // }
      const newBotMessage = {
        sender: 'bot',
        content: response.data.content // Assuming 'content' holds the response
      };

      // Update the messages state with the bot's response
      setMessages(prevMessages => [...prevMessages, newBotMessage]);

    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { sender: 'bot', message: '오류 발생!' }]);
    } finally {
      setLoading(false);
    }
    scrollToBottom();
  };

  useEffect(() => {
    // This effect ensures that whenever messages are updated, the view scrolls to the latest message
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' && !isComposing) {
      event.preventDefault(); // 기본 이벤트 방지
      if (action === 'sendMessage') {
        handleSendMessage();  // 메시지 전송 함수 호출
      } else if (action === 'createRoom') {
        handleCreateRoom();  // 채팅방 생성 함수 호출
      }
    }
  };

  // 채팅방 대화 내용 가져오기
  const fetchMessages = async (roomId) => {
    setLoading(true);
    try {
      const response = await api.get(`/chat/messages/${roomId}`);
      if (response.data) {
        const sortedMessages = response.data.sort((a, b) => a.id - b.id); // 메시지 ID 기준으로 정렬
        setMessages(sortedMessages);
      }
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setLoading(false);
    }
  };

  // 채팅방 선택시 메시지 가져오기
  const selectRoom = (room) => {
    setSelectedRoom(room);
    setSelectedRoomTitle(room.title); // 채팅방 제목 설정
    setMessages([]);
    fetchMessages(room.id);
  };

  const deleteRoom = async (roomId) => {
    console.log(roomId)
    if (window.confirm("채팅방과 모든 채팅 내용을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/chat/rooms/${roomId}`
        );
        setRooms(prev => prev.filter(room => room.id !== roomId));
        if (selectedRoom?.id === roomId) {
          setSelectedRoomTitle('');
          setSelectedRoom(null);
          setMessages([]);
        }
        alert("삭제되었습니다.");
      } catch (error) {
        console.error('Failed to delete room:', error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const formatMessage = (message) => {
    const boldRegex = /\*\*(.*?)\*\*/g; // 볼드 마크다운 탐지 정규식
    const headerRegex = /^(#+)\s*(.*)$/gm; // 헤더 마크다운 탐지 정규식

    let formattedMessage = message.replace(boldRegex, "<strong>$1</strong>"); // 볼드를 <strong>으로 변경

    // 헤더 마크다운을 적절한 <h?> 태그로 변경
    formattedMessage = formattedMessage.replace(headerRegex, (match, hashes, text) => {
      const level = hashes.length; // #의 개수에 따라 헤더 레벨 결정
      return `<h${level}>${text}</h${level}>`; // 예: "### Header" -> <h3>Header</h3>
    });

    // 줄바꿈을 감지하여 각 줄을 별도의 <p> 태그로 래핑
    return formattedMessage.split('\n').map((line, index) => (
      <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>
    ));
  };

  return (

    <div className={`flex ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
      {showRooms && (
        <div className={`flex-shrink-0 w-72 p-5 ${theme === 'dark' ? 'bg-gray-700 shadow-lg' : 'bg-white shadow-lg'} overflow-hidden h-screen`}>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-indigo-600'} mb-6`}>{text.chatroomlist}</h2>
          <div className="space-y-4">
            <input
              className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-100 border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300`}
              placeholder={text.chatinput}
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'createRoom')}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
            />
            <button
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
              onClick={handleCreateRoom}
            >
              <PlusIcon className="h-5 w-5" />
              <span>{text.chatcreate}</span>
            </button>
          </div>
          <div className="mt-6 overflow-y-auto space-y-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`flex justify-between items-center p-3 cursor-pointer rounded-lg transition duration-300 ${selectedRoom?.id === room.id ? 'bg-indigo-100 text-indigo-700' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} `}
                onClick={() => selectRoom(room)}
              >
                <span className="truncate">{room.title}</span>
                <TrashIcon
                  className="h-5 w-5 text-gray-400 hover:text-red-500 transition duration-300"
                  onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className={`p-3 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} focus:outline-none transition duration-300`}
        onClick={toggleRooms}
      >
        {showRooms ? <ChevronLeftIcon className="h-6 w-6 text-indigo-600" /> : <ChevronRightIcon className="h-6 w-6 text-indigo-600" />}
      </button>

      <div className="flex-grow p-6 flex flex-col h-screen">
        <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-indigo-700'}`}>{selectedRoomTitle || '인공지능 챗봇'}</h1>
        <div
          ref={messagesContainerRef}
          className={`flex-grow flex flex-col space-y-4 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 p-4 rounded-lg shadow-lg' : 'bg-white p-4 rounded-lg shadow-lg'} mb-4 custom-scrollbar`}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-3/4 ${msg.sender === 'user' ? theme === 'dark' ? 'bg-gray-700 text-white ml-auto' : 'bg-indigo-100 text-indigo-800 ml-auto' : theme === 'dark' ? 'bg-gray-600 text-gray-200 mr-auto' : 'bg-gray-100 text-gray-800 mr-auto'}`}
              >
                {formatMessage(msg.content)} {/* 메시지 형식화 함수 적용 */}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">
              {text.nomessage}
            </div>
          )}
          {loading && <span className="text-gray-400 animate-pulse">{text.loading}</span>}
        </div>
        <div className={`rounded-lg flex sticky bottom-0 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} p-4`}>
          <input
            type="text"
            className={`flex-grow p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300`}
            placeholder="Please Input Message"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'sendMessage')}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-r-lg transition duration-300 flex items-center justify-center transform hover:scale-105"
            onClick={handleSendMessage}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>



  );
};


export default Chatbot;

<style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(243, 244, 246, 0.7);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(99, 102, 241, 0.5);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(99, 102, 241, 0.7);
  }
`}</style>