package com.financetracker.controller;

import com.financetracker.dto.*;
import com.financetracker.repository.UserRepository;
import com.financetracker.service.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvestmentResponse>>> getAll(@AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.ok(investmentService.getAll(uid(p))));
    }

    @GetMapping("/portfolio")
    public ResponseEntity<ApiResponse<InvestmentService.PortfolioSummary>> getPortfolio(@AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(ApiResponse.ok(investmentService.getPortfolioSummary(uid(p))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvestmentResponse>> getById(@AuthenticationPrincipal UserDetails p, @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(investmentService.getById(uid(p), id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InvestmentResponse>> create(@AuthenticationPrincipal UserDetails p, @Valid @RequestBody InvestmentRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.ok("Investment added", investmentService.create(uid(p), req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvestmentResponse>> update(@AuthenticationPrincipal UserDetails p, @PathVariable String id, @Valid @RequestBody InvestmentRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Investment updated", investmentService.update(uid(p), id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal UserDetails p, @PathVariable String id) {
        investmentService.delete(uid(p), id);
        return ResponseEntity.ok(ApiResponse.ok("Investment removed", null));
    }

    private String uid(UserDetails p) {
        return userRepository.findByEmail(p.getUsername()).orElseThrow().getId();
    }
}
