package mallapi.demo.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ChatRoom chatRoom;

    @Column(columnDefinition = "TEXT")
    private String inputMessage;

    // 추가한것
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(columnDefinition = "TEXT")
    private String responseMessage;

    private String sender; // 'user' or 'bot'

    private LocalDateTime messageTime;

    public ChatMessage(ChatRoom chatRoom, String inputMessage, String responseMessage) {
        this.chatRoom = chatRoom;
        this.inputMessage = inputMessage;
        this.responseMessage = responseMessage;
        this.messageTime = LocalDateTime.now();
    }

    // Updated constructor to include the sender
    public ChatMessage(ChatRoom chatRoom, String inputMessage, String responseMessage, String sender) {
        this.chatRoom = chatRoom;
        this.inputMessage = inputMessage;
        this.responseMessage = responseMessage;
        this.sender = sender;
        this.messageTime = LocalDateTime.now();
    }
}