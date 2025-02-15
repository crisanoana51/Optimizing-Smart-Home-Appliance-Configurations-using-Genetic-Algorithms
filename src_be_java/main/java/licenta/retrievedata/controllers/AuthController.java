package licenta.retrievedata.controllers;


import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import licenta.retrievedata.entitites.Role;
import licenta.retrievedata.entitites.User;
import licenta.retrievedata.payload.request.LoginRequest;
import licenta.retrievedata.payload.request.SignupRequest;
import licenta.retrievedata.payload.response.IntermediateJwtResponse;
import licenta.retrievedata.payload.response.JwtResponse;
import licenta.retrievedata.payload.response.MessageResponse;
import licenta.retrievedata.services.AuthService;
import licenta.retrievedata.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Operation(summary = "Sign in", description = "Sign in with username and password")
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User user = new User();
        user.setUsername(loginRequest.getUsername());
        user.setPassword(loginRequest.getPassword());
        IntermediateJwtResponse intermediateJwtResponse = authService.login(user);
        return ResponseEntity.ok(new JwtResponse(intermediateJwtResponse.getJwt(),
                intermediateJwtResponse.getUserDetails().getId(),
                intermediateJwtResponse.getUserDetails().getUsername(),
                intermediateJwtResponse.getUserDetails().getEmail(),
                intermediateJwtResponse.getUserDetails().getFirstName(),
                intermediateJwtResponse.getUserDetails().getLastName(),
                intermediateJwtResponse.getRoles()));
    }

    @Operation(summary = "Sign up", description = "Sign up with username, email, password, first name and last name")
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), signUpRequest.getFirstName(), signUpRequest.getLastName(), true);
        List<Role> roles = userService.insertUserRole();
        if (!roles.isEmpty()) {
            user.setRoles(roles.get(0));
        }
        try {
            userService.createUser(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Operation(summary = "Find all users", description = "Finds all users")
    @GetMapping("/findAll")
    public List<User> findAll() {
        return userService.findAllUsers();
    }
}
