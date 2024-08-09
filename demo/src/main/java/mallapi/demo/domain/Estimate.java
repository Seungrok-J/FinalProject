package mallapi.demo.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Setter
@Getter
@Entity
@Table(name = "estimate")
public class Estimate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long estimateIdx;

    @ManyToOne
    @JoinColumn(name = "userNo")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String estimateResult;
    
    private Double estimatedValue;
    private Date createDate = new Date();

    // Getters and Setters
}
