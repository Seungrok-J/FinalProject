package mallapi.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import mallapi.demo.domain.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByUserNo(int userNo);
}