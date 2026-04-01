package com.financetracker.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class RegisterRequest {
    @NotBlank public String fullName;
    @NotBlank @Email public String email;
    @NotBlank @Size(min=6) public String password;
    public String currency = "USD";
}
