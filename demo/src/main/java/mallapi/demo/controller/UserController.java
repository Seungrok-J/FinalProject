package mallapi.demo.controller;

import mallapi.demo.domain.User;
import mallapi.demo.dto.MemberDTO;
import mallapi.demo.service.UserService;
import mallapi.demo.util.JWTUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import java.util.Collections;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        //logger.info("Attempting to register user with email: {} and password: {}", user.getUserEmail(), user.getPassword());
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password cannot be null or empty.");
        }
        Optional<User> existingUser = userService.findByUserEmail(user.getUserEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }
        User savedUser = userService.save(user);
        MemberDTO memberDTO = new MemberDTO(savedUser.getUserEmail(), savedUser.getUserName(), savedUser.getNo());
        return ResponseEntity.ok(memberDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        //logger.info("로그인 시도: {}", user.getUserEmail());
        //logger.info("입력한 패스워드 : {}", user.getPassword());
        User authenticatedUser = userService.authenticateUser(user.getUserEmail(),
                user.getPassword());
        if (authenticatedUser == null) {
            logger.warn("로그인 실패: {}", user.getUserEmail());
            return ResponseEntity.badRequest().body("Invalid email or password.");
        }
        // 아래의 타입 변경: `Long`에서 `Integer`로 변환하여 `generateToken`에 전달합니다.
        String token = JWTUtil.generateToken(authenticatedUser.getUserEmail(),
                authenticatedUser.getUserName(),
                authenticatedUser.getNo(), 60); // 60분 유효
        MemberDTO memberDTO = new MemberDTO(authenticatedUser.getUserEmail(),
                authenticatedUser.getUserName(),
                authenticatedUser.getNo());
        memberDTO.setToken(token);
        //logger.info("로그인 성공: {}", memberDTO.getUserEmail());
        return ResponseEntity.ok(memberDTO);
    }

    @GetMapping("/{no}")
    public ResponseEntity<MemberDTO> getUserById(@PathVariable int no) {
        return userService.findByNo(no)
                .map(user -> {
                    // 사용자가 존재하는 경우, DTO 생성 및 반환
                    MemberDTO memberDTO = new MemberDTO(user.getUserEmail(), user.getUserName(), user.getNo());
                    return ResponseEntity.ok(memberDTO);
                })
                .orElseGet(() -> ResponseEntity.notFound().build()); // 사용자가 존재하지 않는 경우, 404 Not Found 반환
    }

    @PutMapping("/{no}")
    public ResponseEntity<MemberDTO> updateUser(@PathVariable int no, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(no, userDetails);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        MemberDTO memberDTO = new MemberDTO(updatedUser.getUserEmail(), updatedUser.getUserName(), updatedUser.getNo());
        return ResponseEntity.ok(memberDTO);
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<?> deleteUser(@PathVariable int no) {
        if (userService.findByNo(no) == null) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteUser(no);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody String tokenId) {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList("1070105526530-ooc758op98s4qouh54sb4bhv284lp72u.apps.googleusercontent.com"))
                .build();
    
        try {
            GoogleIdToken idToken = verifier.verify(tokenId);
            if (idToken != null) {
                Payload payload = idToken.getPayload();
                String userId = payload.getSubject();
                String email = payload.getEmail();
                boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
                
                if (emailVerified) {
                    User user = userService.verifyOrRegisterUser(userId, email);
                    if (user != null) {
                        String token = JWTUtil.generateToken(user.getUserEmail(), user.getUserName(), user.getNo(), 60);
                        MemberDTO memberDTO = new MemberDTO(user.getUserEmail(), user.getUserName(), user.getNo(), token);
                        
                        return ResponseEntity.ok(memberDTO);
                    } else {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to register or retrieve user.");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email not verified");
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google ID token.");
        } catch (Exception e) {
            logger.error("Error verifying Google ID token: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying Google ID token: " + e.getMessage());
        }
    }

    @GetMapping("/login")
    public String login() {
        // 이 경로에서 리액트 빌드 파일을 제공하거나, 적절한 뷰를 리턴합니다.
        return "login"; // `login.html`을 반환하거나, 리액트 빌드 파일의 경로를 지정
    }

}