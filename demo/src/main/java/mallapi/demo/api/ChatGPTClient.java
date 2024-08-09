package mallapi.demo.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import mallapi.demo.domain.ChatMessage;
import mallapi.demo.repository.ChatMessageRepository;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class ChatGPTClient {
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    private static final Logger log = LoggerFactory.getLogger(ChatGPTClient.class);
    private final String API_KEY = ".";
    private final RestTemplate restTemplate = new RestTemplate();

    public String getChatGPTResponse(String input, Long chatRoomId) {

        List<ChatMessage> pastMessages = chatMessageRepository.findTop10ByChatRoomIdOrderByIdDesc(chatRoomId);

        // 과거 메시지를 JSONObject 배열로 변환
        JSONArray pastMessagesJson = new JSONArray();
        for (ChatMessage message : pastMessages) {
            JSONObject msgJson = new JSONObject();
            msgJson.put("role", message.getSender().equals("user") ? "user" : "system");
            msgJson.put("content", message.getContent());
            pastMessagesJson.put(msgJson);
        }
        JSONObject inputMessageJson = new JSONObject();
        inputMessageJson.put("role", "user");
        inputMessageJson.put("content", input);
        pastMessagesJson.put(inputMessageJson);

        //log.info("Complete conversation for Chat Room ID {}: {}", chatRoomId, pastMessagesJson.toString());
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + API_KEY);

            JSONObject body = new JSONObject();
            body.put("model", "gpt-4o-mini");
            body.put("messages", new JSONObject[] { new JSONObject().put("role", "user").put("content", input) });
            body.put("messages", pastMessagesJson);
            body.put("max_tokens", 512);
            body.put("top_p", 1);
            body.put("temperature", 0.5);
            body.put("frequency_penalty", 0.5);
            body.put("presence_penalty", 0.5);
            //body.put("stop", new String[] { "\n" });

            HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions", request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                //log.info("API Response: {}", jsonResponse.toString(2)); // JSON 응답 로깅
                // 응답에서 'content' 키의 값을 가져옵니다.
                return jsonResponse.getJSONArray("choices").getJSONObject(0).getJSONObject("message")
                        .getString("content");
            } else {
                return "Failed to process request due to server error";
            }
        } catch (Exception e) {
            log.error("Exception occurred while calling OpenAI: ", e);
            return "Error processing your request: " + e.getMessage();
        }
    }
}