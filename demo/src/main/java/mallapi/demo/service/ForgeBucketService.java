package mallapi.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class ForgeBucketService {

        @Value("${forge.base.url}")
        private String baseUrl;

        private final WebClient webClient;

        public ForgeBucketService() {
                this.webClient = WebClient.create(baseUrl);
        }

        public Mono<String> createBucket(String accessToken, String bucketKey) {
                return webClient.post()
                                .uri("/oss/v2/buckets")
                                .header("Authorization", "Bearer " + accessToken)
                                .header("Content-Type", "application/json")
                                .bodyValue("{\"bucketKey\": \"" + bucketKey + "\", \"policyKey\": \"transient\"}")
                                .retrieve()
                                .bodyToMono(Map.class)
                                .map(response -> (String) response.get("bucketKey"));
        }

        public Mono<String> uploadFile(String bucketKey, String fileName, byte[] fileData) {
                return webClient.put()
                                .uri("/oss/v2/buckets/" + bucketKey + "/objects/" + fileName)
                                .header("Content-Type", "application/octet-stream")
                                .bodyValue(fileData)
                                .retrieve()
                                .bodyToMono(Map.class)
                                .map(response -> (String) response.get("objectId"));
        }

        public Mono<String> translateFileToViewable(String accessToken, String urn) {
                String payload = String.format("{\"input\": {\"urn\": \"%s\"}, \"output\": {\"formats\": [{\"type\": \"svf\", \"views\": [\"2d\", \"3d\"]}]}}", urn);
                return webClient.post()
                    .uri("/modelderivative/v2/designdata/job")
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(response -> response.toString())
                    .onErrorResume(e -> Mono.error(new RuntimeException("Failed to start translation job", e)));
            }
}