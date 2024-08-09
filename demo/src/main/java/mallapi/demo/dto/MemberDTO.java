package mallapi.demo.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;
import java.util.Collections;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class MemberDTO {
    private String userEmail;
    private String userName;
    private int no;
    private String token; // 추가

    

    // 생성자, getter, setter

    public MemberDTO(String userEmail, String userName, int no) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.no = no;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 임시로 모든 사용자에게 ROLE_USER 권한 부여
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }
}
