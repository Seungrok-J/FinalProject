package mallapi.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceRegistrationRequest {

    private Integer userNo;
    private Long cadDataId;
    private String filePath;
    private String title;
    private Double budget;
    private String detail;
    private String materials;
    private String company;



}