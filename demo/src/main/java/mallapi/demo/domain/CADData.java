package mallapi.demo.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "CAD_data")
public class CADData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID 자동 생성 설정
    private Long id;  // DB에서 관리하는 Primary Key

    @Column(name = "file_idx", nullable = false, unique = true)
    private String fileIdx;

    @Column(name = "file_number", nullable = false)
    private String fileNumber;

    @Column(name = "detail")
    private String detail;  // 조립품 또는 부품 여부

    @Column(name = "title")
    private String title;   // CAD 파일의 타이틀

    @Column(name = "materials")
    private String materials; // 사용된 재료들

    @Column(name = "budget")
    private double budget;

    @Column(name = "company")
    private String company;




}