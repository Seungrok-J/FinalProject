package mallapi.demo.domain;

import org.hibernate.annotations.CreationTimestamp;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;
    
    private String userName;
    
    private String password;

    private String userEmail;

    private String role = "ROLE_USER"; // ROLE_USER, ROLE_ADMIN

    private String userId; // Google의 고유 사용자 ID

    @CreationTimestamp
    private LocalDateTime createDate;

    
}