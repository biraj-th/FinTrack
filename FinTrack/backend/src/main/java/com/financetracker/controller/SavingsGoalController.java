package com.financetracker.controller;

import com.financetracker.dto.*;
import com.financetracker.repository.UserRepository;
import com.financetracker.service.SavingsGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/savings-goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SavingsGoalResponse>>> getAll(@AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.ok(savingsGoalService.getAll(uid(p))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> getById(@AuthenticationPrincipal UserDetails p, @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(savingsGoalService.getById(uid(p), id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> create(@AuthenticationPrincipal UserDetails p, @Valid @RequestBody SavingsGoalRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.ok("Goal created", savingsGoalService.create(uid(p), req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> update(@AuthenticationPrincipal UserDetails p, @PathVariable String id, @Valid @RequestBody SavingsGoalRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Goal updated", savingsGoalService.update(uid(p), id, req)));
    }

    @PostMapping("/{id}/add-funds")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> addFunds(@AuthenticationPrincipal UserDetails p, @PathVariable String id, @RequestBody Map<String, BigDecimal> body) {
        BigDecimal amount = body.get("amount");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid amount"));
        return ResponseEntity.ok(ApiResponse.ok("Funds added", savingsGoalService.addFunds(uid(p), id, amount)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal UserDetails p, @PathVariable String id) {
        savingsGoalService.delete(uid(p), id);
        return ResponseEntity.ok(ApiResponse.ok("Goal deleted", null));
    }

    private String uid(UserDetails p) {
        return userRepository.findByEmail(p.getUsername()).orElseThrow().getId();
    }
}
