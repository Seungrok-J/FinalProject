package mallapi.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mallapi.demo.dto.TranslationRequest;
import mallapi.demo.service.TranslationService;

@RestController
@RequestMapping("/api/translate")
public class TranslationController {
    
    private final TranslationService translationService;

    @Autowired
    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping
    public String translate(@RequestBody TranslationRequest request) {
        return translationService.translateText(request.getText(), request.getTargetLanguage());
    }
}