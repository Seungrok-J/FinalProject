package mallapi.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.Translation;

@Service
public class TranslationService {

    @Autowired
    private Translate translate;

    public String translateText(String text, String targetLanguage) {
        Translation translation = translate.translate(text, Translate.TranslateOption.targetLanguage(targetLanguage));
        return translation.getTranslatedText();
    }
}