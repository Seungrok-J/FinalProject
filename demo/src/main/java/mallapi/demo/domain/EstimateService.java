package mallapi.demo.domain;

import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class EstimateService {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long estimateIdx;

    private String img; // URL or path to the image

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userno", nullable = false)
    private User user; // Reference to User entity as a foreign key

    private double width;
    private double height;
    private double depth;
    private double estimateCost;

    @CreationTimestamp
    private LocalDateTime serviceDate; // Automatically set the date when the record is created

}