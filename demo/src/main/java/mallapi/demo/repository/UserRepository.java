package mallapi.demo.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import mallapi.demo.domain.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserEmail(String userEmail);
    Optional<User> findByUserId(String userId);
    Optional<User> findByUserName(String userName); // 이 메소드 추가
}
