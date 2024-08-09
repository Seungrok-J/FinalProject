package mallapi.demo.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class OAuth2Service {

    @Value("${forge.client.id}")
    private String clientId;

    @Value("${forge.client.secret}")
    private String clientSecret;

    @Value("${forge.base.url}")
    private String baseUrl;

    @Value("${forge.scope}")
    private String scope;

    private final WebClient webClient;

    public OAuth2Service() {
        this.webClient = WebClient.create(baseUrl);
    }

    public Mono<String> getAccessToken(String clientId, String clientSecret, String scope) {
        return webClient.post()
                .uri("/authentication/v2/token")
                .contentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("client_id", clientId)
                                   .with("client_secret", clientSecret)
                                   .with("grant_type", "client_credentials")
                                   .with("scope", scope))
                .retrieve()
                .onStatus(status -> status.isError(), response -> 
                    response.bodyToMono(String.class).flatMap(error -> 
                        Mono.error(new RuntimeException("API call failed with error: " + error))))
                .bodyToMono(Map.class)
                .map(response -> response.get("access_token").toString())
                .doOnError(error -> System.out.println("Error retrieving access token: " + error.getMessage()));
    }
}