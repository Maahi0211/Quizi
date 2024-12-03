package com.quizi.server.controller;

import com.quizi.server.dto.UserDTO;
import com.quizi.server.dto.UserLoginDto;
import com.quizi.server.dto.UserRegisterDto;
import com.quizi.server.model.User;
import com.quizi.server.service.UserService;
import com.quizi.server.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegisterDto userRegisterDto) {
        String response = userService.registerUser(userRegisterDto);
        if (response.equals("Email already in use")) {
            return ResponseEntity.status(400).body(response); // Bad Request if email exists
        }
        return ResponseEntity.ok(response); // OK if registered successfully
    }

    // Login and get JWT token
    @PostMapping("/login")
    public ResponseEntity<HashMap<String, String>> login(@RequestBody UserLoginDto userLoginDto) {
        String token = userService.authenticateUser(userLoginDto);

        if (token.equals("Invalid credentials")) {
            return ResponseEntity.status(401).body(null); // Unauthorized if invalid credentials
        }

        HashMap<String, String> response = new HashMap<>();
        response.put("token", token); // Return the token if login successful
        return ResponseEntity.ok(response); // OK with the token
    }

    @GetMapping("/user-detail")
    public ResponseEntity<UserDTO> userDetail(@RequestHeader("Authorization") String authHeader){
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            return ResponseEntity.badRequest().build();
        }

        String token=authHeader.substring(7);
        try{
            String email=jwtUtil.extractUsername(token);
            UserDTO user=userService.getUserByEmail(email);
            if(user != null){
                return ResponseEntity.ok(user);
            }
            else {
                return ResponseEntity.badRequest().build();
            }
        }
        catch (Exception e){
            return ResponseEntity.status(401).build();
        }
    }
}
