package mallapi.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import java.io.IOException;
import java.util.List;

@Configuration
public class TranslationConfig {

    @Value("${google.cloud.translate.default.project-id}")
    private String projectId;

    @Value("${google.cloud.translate.default.credentials.file.path}")
    private String credentialsPath;

    private final ResourceLoader resourceLoader;

    public TranslationConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Bean
    public Translate translate() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.fromStream(
            resourceLoader.getResource(credentialsPath).getInputStream())
            .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));
        return TranslateOptions.newBuilder().setCredentials(credentials).build().getService();
    }
}
