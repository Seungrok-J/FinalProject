package mallapi.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ChatRoomRequest {
    private String title;
    private Integer userId; // ID 타입을 Integer로 수정

    // 생성자, getter, setter 생략
}