package licenta.retrievedata.services;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import licenta.retrievedata.entitites.ERole;
import licenta.retrievedata.entitites.Role;
import licenta.retrievedata.entitites.User;
import licenta.retrievedata.repositories.RoleRepository;
import licenta.retrievedata.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Value("${bezkoder.app.jwtSecret}")
    private String secretKey;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;

    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setEmail(updatedUser.getEmail());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) throws Exception {
        userRepository.save(user);
        return user;
    }

    public List<Role> insertUserRole() {
        List<Role> roles = new ArrayList<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_CLIENT)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        return roles;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

}