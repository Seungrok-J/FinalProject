package mallapi.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mallapi.demo.domain.User;
import mallapi.demo.repository.UserRepository;
import mallapi.demo.util.JWTUtil;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public User authenticateUser(String userEmail, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUserEmail(userEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (checkPassword(rawPassword, user.getPassword())) {
                //logger.info("Authentication successful for user: {}", userEmail);
                return user;
            } else {
                //logger.warn("Invalid password attempt for user: {}", userEmail);
            }
        } else {
            //logger.warn("User not found with email: {}", userEmail);
        }
        return null;
    }

    public Optional<User> findByUserEmail(String userEmail) {
        Optional<User> userOpt = userRepository.findByUserEmail(userEmail);
        if (userOpt.isPresent()) {
            //logger.info("User found with email: {}", userEmail);
        } else {
            //logger.info("No user found with email: {}", userEmail);
        }
        return userOpt;
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public User save(User user) {
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByNo(int no) {
        return userRepository.findById(no);
    }

    @Transactional
    public User updateUser(int no, User userDetails) {
        Optional<User> userOpt = userRepository.findById(no);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            updateUserData(userDetails, user);
            return userRepository.save(user);
        }
        //logger.error("User not found with id: {}", no);
        return null;
    }

    private void updateUserData(User userDetails, User user) {
        boolean isUpdated = false;
        if (userDetails.getUserName() != null) {
            user.setUserName(userDetails.getUserName());
            isUpdated = true;
        }
        if (userDetails.getUserEmail() != null) {
            user.setUserEmail(userDetails.getUserEmail());
            isUpdated = true;
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            isUpdated = true;
        }
        if (isUpdated) {
            //logger.info("Updated user details for user: {}", user.getUserEmail());
        }
    }

    public void deleteUser(int no) {
        userRepository.deleteById(no);
        //logger.info("Deleted user with id: {}", no);
    }

    public User verifyOrRegisterUser(String userId, String email) {
        Optional<User> existingUser = userRepository.findByUserEmail(email);
        if (existingUser.isPresent()) {
            //logger.info("User already exists: {}", email);
            return existingUser.get();
        } else {
            //logger.info("Registering new user with email: {}", email);
            User newUser = User.builder()
                    .userEmail(email)
                    .userName(email) // userName을 email로 설정
                    .userId(userId) // Google로부터 받은 고유 ID
                    .password(passwordEncoder.encode("defaultPassword")) // 임시 패스워드 설정
                    .role("ROLE_USER") // 기본적으로 ROLE_USER 권한 부여
                    .build();
            return userRepository.save(newUser);
        }
    }

    public String generateJwtToken(User user) {
        return JWTUtil.generateToken(user.getUserEmail(), user.getUserName(), user.getNo(), 60);
    }
}