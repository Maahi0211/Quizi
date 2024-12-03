package com.quizi.server.service;

import com.quizi.server.dto.UserDTO;
import com.quizi.server.dto.UserLoginDto;
import com.quizi.server.dto.UserRegisterDto;
import com.quizi.server.model.User;
import com.quizi.server.repo.UserRepo;
import com.quizi.server.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    // Register new user
    public String registerUser(UserRegisterDto userRegisterDto) {
        Optional<User> existingUser = userRepo.findByEmail(userRegisterDto.getEmail());
        if (existingUser.isPresent()) {
            return "Email already in use";
        }

        User user = new User();
        user.setEmail(userRegisterDto.getEmail());
        user.setUsername(userRegisterDto.getUsername());
        user.setPassword(passwordEncoder.encode(userRegisterDto.getPassword()));

        userRepo.save(user);
        return "User registered successfully";
    }

    // Authenticate user and generate JWT token
    public String authenticateUser(UserLoginDto userLoginDto) {
        Optional<User> optionalUser = userRepo.findByEmail(userLoginDto.getEmail());

        if (optionalUser.isEmpty() || !passwordEncoder.matches(userLoginDto.getPassword(), optionalUser.get().getPassword())) {
            return "Invalid credentials";
        }

        User dbUser = optionalUser.get();
        return jwtUtil.generateToken(dbUser.getEmail(), new HashMap<>());
    }

    public UserDTO getUserByEmail(String email) {
        Optional<User> userOptional= userRepo.findByEmail(email);
        return userOptional.map(this::mapToDTO).orElse(null);
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }
}
