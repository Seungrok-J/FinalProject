package mallapi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import mallapi.demo.domain.ChatMessage;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoom_Id(Long chatRoomId);

    void deleteByChatRoomId(Long chatRoomId);

    // New method to fetch the last 10 messages for a given chat room, ordered by
    // descending ID
    List<ChatMessage> findTop10ByChatRoomIdOrderByIdDesc(Long chatRoomId);
}
