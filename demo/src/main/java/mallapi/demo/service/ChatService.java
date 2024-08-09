package mallapi.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mallapi.demo.api.ChatGPTClient;
import mallapi.demo.domain.ChatMessage;
import mallapi.demo.domain.ChatRoom;
import mallapi.demo.domain.User;
import mallapi.demo.repository.ChatMessageRepository;
import mallapi.demo.repository.ChatRoomRepository;
import mallapi.demo.repository.UserRepository;

import java.util.List;

@Service
public class ChatService {
    private final ChatGPTClient chatGPTClient;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public ChatService(ChatGPTClient chatGPTClient, ChatMessageRepository chatMessageRepository,
            ChatRoomRepository chatRoomRepository, UserRepository userRepository) {
        this.chatGPTClient = chatGPTClient;
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
    }

    public ChatMessage saveMessage(Long chatRoomId, String inputMessage, String responseMessage) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        ChatMessage chatMessage = new ChatMessage(chatRoom, inputMessage, responseMessage);
        return chatMessageRepository.save(chatMessage);
    }

    // 채팅대화내용 가져오기
    public List<ChatMessage> getMessagesByChatRoomId(Long chatRoomId) {
        return chatMessageRepository.findByChatRoom_Id(chatRoomId);
    }

    // UserId를 기반으로 채팅방 찾기
    public List<ChatRoom> getRoomsByUserNo(int userNo) {
        return chatRoomRepository.findByUserNo(userNo);
    }

    public ChatMessage sendMessage(Long chatRoomId, Integer userId, String input) {
        String aiResponse = chatGPTClient.getChatGPTResponse(input,chatRoomId);
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatMessage message = new ChatMessage(chatRoom, input, aiResponse, "user"); // 'user'는 메시지를 보낸 사람을 지정
        return chatMessageRepository.save(message);
    }

    public ChatRoom createChatRoom(String title, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ChatRoom chatRoom = new ChatRoom(title, user);
        return chatRoomRepository.save(chatRoom);
    }

    @Transactional
    public void deleteChatRoom(Long chatRoomId) {
        // 먼저 채팅방의 모든 메시지를 삭제
        chatMessageRepository.deleteByChatRoomId(chatRoomId);
        // 채팅방 삭제
        chatRoomRepository.deleteById(chatRoomId);
    }
}