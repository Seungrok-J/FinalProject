package mallapi.demo.domain;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlueprintRequest {
    private String detailed;
    private List<String> company;
    private List<String> materials;
    private String details;

    // getters and setters
}
