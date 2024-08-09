package mallapi.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import jakarta.persistence.EntityNotFoundException;
import mallapi.demo.service.ChatService;
import mallapi.demo.api.ChatGPTClient;
import mallapi.demo.domain.ChatMessage;
import mallapi.demo.domain.ChatRoom;
import mallapi.demo.dto.ChatRoomRequest;
import mallapi.demo.repository.ChatMessageRepository;
import mallapi.demo.repository.ChatRoomRepository;
import mallapi.demo.repository.UserRepository;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatGPTClient chatGPTClient;

    // 채팅방 목록 조회 메소드
    @GetMapping("/rooms/userno/{userNo}")
    public ResponseEntity<List<ChatRoom>> getChatRoomsByUserNo(@PathVariable int userNo) {
        List<ChatRoom> rooms = chatService.getRoomsByUserNo(userNo);
        return ResponseEntity.ok(rooms);
    }

    // 채팅방 생성
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoom> createChatRoom(@RequestBody ChatRoomRequest chatRoomDto) {
        ChatRoom newRoom = chatService.createChatRoom(chatRoomDto.getTitle(), chatRoomDto.getUserId());
        return ResponseEntity.ok(newRoom);
    }

    // 메시지 전송 및 AI 응답 받기 메소드
    @PostMapping("/process/{chatRoomId}")
    public ResponseEntity<ChatMessage> processMessage(@PathVariable Long chatRoomId,
            @RequestBody Map<String, String> payload) {
        // 인증 정보 검증
        // Authentication authentication =
        // SecurityContextHolder.getContext().getAuthentication();
        // CustomUserDetails userDetails = (CustomUserDetails)
        // authentication.getPrincipal();
        // int userId = userDetails.getUserId();

        // 채팅방과 사용자 정보 조회
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid chat room ID: " + chatRoomId));
        // User user = userRepository.findById(userId)
        // .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " +
        // userId));

        // 입력된 메시지 처리
        String inputMessage = payload.get("inputMessage");

        // GPT 모델 호출하여 AI 응답 받기
        String responseMessage = chatGPTClient.getChatGPTResponse(inputMessage, chatRoomId);

        // 사용자 메시지 저장
        // ChatMessage chatMessage = new ChatMessage(chatRoom, inputMessage,
        // responseMessage, "user");
        // 사용자 메시지 저장
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setContent(inputMessage); // 'content' 필드에 메시지 텍스트를 저장한다고 가정
        chatMessage.setInputMessage(inputMessage);
        chatMessage.setResponseMessage(responseMessage);
        chatMessage.setMessageTime(LocalDateTime.now());
        chatMessage.setSender("user"); // 또는 사용 가능한 경우 실제 사용자 식별자 사용

        chatMessageRepository.save(chatMessage);

        // AI 응답 메시지 저장
        // ChatMessage responseChatMessage = new ChatMessage(chatRoom, inputMessage,
        // responseMessage, "bot");
        // chatMessageRepository.save(responseChatMessage);

        // AI 응답 저장
        ChatMessage responseChatMessage = new ChatMessage();
        responseChatMessage.setChatRoom(chatRoom);
        responseChatMessage.setInputMessage(inputMessage);
        responseChatMessage.setContent(responseMessage);
        responseChatMessage.setMessageTime(LocalDateTime.now());
        responseChatMessage.setSender("bot");

        chatMessageRepository.save(responseChatMessage);

        // return ResponseEntity.ok(responseChatMessage);
        // AI 응답 메시지를 반환
        return ResponseEntity.ok(responseChatMessage);

    }

    // 채팅방별 메시지 조회 메소드
    @GetMapping("/messages/{chatRoomId}")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long chatRoomId) {
        List<ChatMessage> messages = chatService.getMessagesByChatRoomId(chatRoomId);
        return ResponseEntity.ok(messages);
    }

    // 채팅방 및 채팅 삭제
    @DeleteMapping("/rooms/{chatRoomId}")
    public ResponseEntity<?> deleteChatRoom(@PathVariable Long chatRoomId) {
        try {
            chatService.deleteChatRoom(chatRoomId);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting the chat room");
        }
    }

}