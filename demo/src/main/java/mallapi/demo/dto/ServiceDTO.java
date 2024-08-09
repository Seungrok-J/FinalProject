package mallapi.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@AllArgsConstructor
@Getter
@Setter
public class ServiceDTO {

    private Long serviceIdx;
    private String filePath;
    private String title;
    private Double budget;
    private String detail;
    private String materials;
    private String company;
    
}
