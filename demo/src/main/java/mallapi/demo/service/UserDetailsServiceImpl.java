package mallapi.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import mallapi.demo.domain.User;
import mallapi.demo.repository.UserRepository;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        System.out.println("Received email: " + userEmail);
        System.out.println("Executing loadUserByUsername");
    
        // Retrieve the user by email, throw exception if not found
        Optional<User> optionalUser = userRepository.findByUserEmail(userEmail);
        User user = optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));
    
        // If user is found, create a UserDetails object with roles
        return new org.springframework.security.core.userdetails.User(
                user.getUserEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(user.getRole())));
    }
}
