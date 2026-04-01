package com.financetracker.controller;

import com.financetracker.dto.*;
import com.financetracker.model.User;
import com.financetracker.repository.UserRepository;
import com.financetracker.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    private static final List<String> AVATAR_COLORS = List.of(
        "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
        "#3b82f6", "#ef4444", "#14b8a6", "#f97316", "#06b6d4"
    );

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email already registered"));
        }

        String color = AVATAR_COLORS.get(new Random().nextInt(AVATAR_COLORS.size()));
        User user = User.builder()
                .fullName(req.fullName)
                .email(req.email)
                .password(passwordEncoder.encode(req.password))
                .currency(req.currency != null ? req.currency : "USD")
                .avatarColor(color)
                .build();

        userRepository.save(user);

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email, req.password));
        String token = jwtUtils.generateToken(auth);

        return ResponseEntity.ok(ApiResponse.ok("Registered successfully",
                buildAuthResponse(token, user)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email, req.password));
        String token = jwtUtils.generateToken(auth);

        User user = userRepository.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(ApiResponse.ok("Login successful",
                buildAuthResponse(token, user)));
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return new AuthResponse(token, "Bearer",
                user.getId(), user.getFullName(),
                user.getEmail(), user.getCurrency(), user.getAvatarColor());
    }
}
