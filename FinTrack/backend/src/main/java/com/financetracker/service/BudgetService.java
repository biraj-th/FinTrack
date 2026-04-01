package com.financetracker.service;

import com.financetracker.dto.*;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.model.*;
import com.financetracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public List<BudgetResponse> getAll(String userId) {
        LocalDate now = LocalDate.now();
        return budgetRepository.findByUserId(userId).stream()
                .map(b -> toResponse(b, userId, now))
                .toList();
    }

    public BudgetResponse getById(String userId, String id) {
        Budget b = find(userId, id);
        return toResponse(b, userId, LocalDate.now());
    }

    public BudgetResponse create(String userId, BudgetRequest req) {
        Budget b = Budget.builder()
                .userId(userId)
                .category(req.category)
                .limitAmount(req.limitAmount)
                .startDate(req.startDate)
                .endDate(req.endDate)
                .period(req.period)
                .color(req.color)
                .icon(req.icon)
                .description(req.description)
                .build();
        return toResponse(budgetRepository.save(b), userId, LocalDate.now());
    }

    public BudgetResponse update(String userId, String id, BudgetRequest req) {
        Budget b = find(userId, id);
        b.setCategory(req.category);
        b.setLimitAmount(req.limitAmount);
        b.setStartDate(req.startDate);
        b.setEndDate(req.endDate);
        b.setPeriod(req.period);
        b.setColor(req.color);
        b.setIcon(req.icon);
        b.setDescription(req.description);
        return toResponse(budgetRepository.save(b), userId, LocalDate.now());
    }

    public void delete(String userId, String id) {
        budgetRepository.delete(find(userId, id));
    }

    private Budget find(String userId, String id) {
        return budgetRepository.findById(id)
                .filter(b -> b.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
    }

    private BudgetResponse toResponse(Budget b, String userId, LocalDate now) {
        // Sum all EXPENSE transactions for this budget's category within its date range
        List<Transaction> txs = transactionRepository
                .findByUserIdAndCategoryAndDateBetween(userId, b.getCategory(), b.getStartDate(), b.getEndDate());
        BigDecimal spent = txs.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = b.getLimitAmount().subtract(spent);
        double pct = b.getLimitAmount().compareTo(BigDecimal.ZERO) > 0
                ? spent.divide(b.getLimitAmount(), 4, RoundingMode.HALF_UP)
                  .multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0;

        return BudgetResponse.builder()
                .id(b.getId())
                .category(b.getCategory())
                .limitAmount(b.getLimitAmount())
                .spentAmount(spent)
                .remainingAmount(remaining)
                .percentageUsed(Math.min(pct, 100))
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .period(b.getPeriod())
                .color(b.getColor())
                .icon(b.getIcon())
                .description(b.getDescription())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
