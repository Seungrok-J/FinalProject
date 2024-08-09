package mallapi.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import mallapi.demo.service.TranslationService;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TranslationServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TranslationService translationService;

    @Test
    public void translateText_returnsTranslatedText() throws Exception {
        String originalText = "안녕하세요";
        String translatedText = "Hello";
        given(translationService.translateText(originalText, "en")).willReturn(translatedText);

        mockMvc.perform(post("/api/translate")
                .contentType("application/json")
                .content("{\"text\":\"안녕하세요\",\"targetLanguage\":\"en\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(translatedText));
    }
}
