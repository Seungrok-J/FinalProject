package mallapi.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TranslationRequest {
    private String text;
    private String targetLanguage;

    // getters and setters
}
