package mallapi.demo;

import com.fasterxml.jackson.databind.ObjectMapper;

import mallapi.demo.controller.UserController;
import mallapi.demo.domain.User;
import mallapi.demo.dto.MemberDTO;
import mallapi.demo.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private UserService userService;

    @MockBean
    private PasswordEncoder passwordEncoder;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    public void registerUser_Success() throws Exception {
        User user = User.builder()
                .userEmail("test@example.com")
                .userName("Test User")
                .password("123456")
                .role("ROLE_USER")
                .no(1) // User 객체에 no 설정
                .build();

        MemberDTO memberDTO = new MemberDTO(user.getUserEmail(), user.getUserName(), 1);

        given(userService.findByUserEmail(any())).willReturn(null);
        given(userService.save(any())).willReturn(user);

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(memberDTO)));
    }

    @Test
    public void loginUser_Success() throws Exception {
        User user = User.builder()
                .userEmail("test@example.com")
                .userName("Test User")
                .password("123456")
                .role("ROLE_USER")
                .no(1) // User 객체에 no 설정
                .build();

        MemberDTO memberDTO = new MemberDTO(user.getUserEmail(), user.getUserName(), 1);

        given(passwordEncoder.matches(eq("123456"), eq(user.getPassword()))).willReturn(true);

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(memberDTO)));
    }

    @Test
    public void registerUser_Fail_ExistingEmail() throws Exception {
        User user = User.builder()
                .userEmail("test@example.com")
                .userName("Test User")
                .password("123456")
                .role("ROLE_USER")
                .build();


        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email already exists."));
    }

    @Test
    public void loginUser_Fail_InvalidCredentials() throws Exception {
        User user = User.builder()
                .userEmail("test@example.com")
                .userName("Test User")
                .password("wrongpassword")
                .role("ROLE_USER")
                .build();

        given(userService.findByUserEmail(any())).willReturn(null);

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email or password."));
    }
}