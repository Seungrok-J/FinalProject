package mallapi.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import mallapi.demo.service.OAuth2Service;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/forge/oauth")
public class OAuth2Controller {

    @Autowired
    private OAuth2Service oauth2Service;

    @Value("${forge.client.id}")
    private String clientId;

    @Value("${forge.client.secret}")
    private String clientSecret;

    @Value("${forge.scope}")
    private String scope;

    @GetMapping("/token")
    public Mono<Map<String, String>> getToken() {
        return oauth2Service.getAccessToken(clientId, clientSecret, scope)
                .map(token -> Map.of("access_token", token, "expires_in", "3600"));
    }
}