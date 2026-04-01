package com.financetracker.controller;

import com.financetracker.dto.*;
import com.financetracker.repository.UserRepository;
import com.financetracker.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAll(@AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.ok(budgetService.getAll(uid(p))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> getById(@AuthenticationPrincipal UserDetails p, @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(budgetService.getById(uid(p), id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> create(@AuthenticationPrincipal UserDetails p, @Valid @RequestBody BudgetRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.ok("Budget created", budgetService.create(uid(p), req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> update(@AuthenticationPrincipal UserDetails p, @PathVariable String id, @Valid @RequestBody BudgetRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Budget updated", budgetService.update(uid(p), id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal UserDetails p, @PathVariable String id) {
        budgetService.delete(uid(p), id);
        return ResponseEntity.ok(ApiResponse.ok("Budget deleted", null));
    }

    private String uid(UserDetails p) {
        return userRepository.findByEmail(p.getUsername()).orElseThrow().getId();
    }
}
