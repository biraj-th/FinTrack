package com.financetracker.dto;
import lombok.*;
@Data @AllArgsConstructor @NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String fullName;
    private String email;
    private String currency;
    private String avatarColor;
}
