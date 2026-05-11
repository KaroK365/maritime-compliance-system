package com.ansh.backend.controller;

import com.ansh.backend.dto.*;
import com.ansh.backend.entity.User;
import com.ansh.backend.repository.UserRepository;
import com.ansh.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request
    ) {

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(request.getPassword())
                )
                .role(request.getRole())
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getName()
        );

        return new AuthResponse(token);
    }
}