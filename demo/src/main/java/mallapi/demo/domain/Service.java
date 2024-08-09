package mallapi.demo.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "services")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userNo")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cadDataId")
    private CADData cadData;

    @Column(nullable = false)
    private String filePath;

    @Column
    private String title;

    @Column
    private Double budget;

    @Column
    private String detail;

    @Column
    private String materials;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "company")
    private String company;


    public Service() {}

    public Service(User user, CADData cadData, String filePath, String title, Double budget, String detail, String materials,String company) {
        this.user = user;
        this.cadData = cadData;
        this.filePath = filePath;
        this.title = title;
        this.budget = budget;
        this.detail = detail;
        this.materials = materials;
        this.company =company;
        this.createdAt = LocalDateTime.now(); // 생성 시 현재 시간 설정
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}