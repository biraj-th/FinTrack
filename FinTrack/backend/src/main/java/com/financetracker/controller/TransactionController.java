package com.financetracker.controller;

import com.financetracker.dto.*;
import com.financetracker.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.financetracker.repository.UserRepository;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getAll(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = getUserId(principal);
        return ResponseEntity.ok(ApiResponse.ok(transactionService.getAll(userId, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getById(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(transactionService.getById(getUserId(principal), id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> create(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody TransactionRequest req) {
        TransactionResponse res = transactionService.create(getUserId(principal), req);
        return ResponseEntity.status(201).body(ApiResponse.ok("Transaction created", res));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> update(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable String id,
            @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Transaction updated",
                transactionService.update(getUserId(principal), id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable String id) {
        transactionService.delete(getUserId(principal), id);
        return ResponseEntity.ok(ApiResponse.ok("Transaction deleted", null));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardSummary>> getDashboard(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(ApiResponse.ok(transactionService.getDashboard(getUserId(principal))));
    }

    private String getUserId(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
