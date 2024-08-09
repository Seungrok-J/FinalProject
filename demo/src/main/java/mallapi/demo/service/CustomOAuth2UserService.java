package mallapi.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    private final UserService userService;

    @Autowired
    public CustomOAuth2UserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oauth2User.getAttributes();

        // 로그 출력을 위한 코드 추가
        //logger.debug("OAuth2 User Attributes: {}", attributes);
        String userEmail = (String) attributes.get("email");

        Optional<mallapi.demo.domain.User> userOpt = userService.findByUserEmail(userEmail);
        mallapi.demo.domain.User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            //logger.info("User exists. Updating details for {}", userEmail);
            user.setUserName((String) attributes.get("name")); // 이름이 변경되었다면 갱신
            userService.save(user);
        } else {
            //logger.info("User does not exist. Creating new user for {}", userEmail);
            user = new mallapi.demo.domain.User();
            user.setUserEmail(userEmail);
            user.setUserName((String) attributes.get("name"));
            user.setPassword(userService.encodePassword("default_password")); // 기본 비밀번호 설정
            user.setRole("ROLE_USER"); // 기본 역할 설정
            userService.save(user);
        }

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole())), // 동적 역할 부여
                attributes,
                "email");
    }
}