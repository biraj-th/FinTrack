package com.financetracker.service;

import com.financetracker.dto.*;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.model.SavingsGoal;
import com.financetracker.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    public List<SavingsGoalResponse> getAll(String userId) {
        return savingsGoalRepository.findByUserId(userId).stream()
                .map(this::toResponse).toList();
    }

    public SavingsGoalResponse getById(String userId, String id) {
        return toResponse(find(userId, id));
    }

    public SavingsGoalResponse create(String userId, SavingsGoalRequest req) {
        SavingsGoal goal = SavingsGoal.builder()
                .userId(userId)
                .name(req.name)
                .description(req.description)
                .targetAmount(req.targetAmount)
                .currentAmount(req.currentAmount != null ? req.currentAmount : BigDecimal.ZERO)
                .targetDate(req.targetDate)
                .status(req.status != null ? req.status : SavingsGoal.GoalStatus.ACTIVE)
                .icon(req.icon)
                .color(req.color)
                .build();
        return toResponse(savingsGoalRepository.save(goal));
    }

    public SavingsGoalResponse update(String userId, String id, SavingsGoalRequest req) {
        SavingsGoal goal = find(userId, id);
        goal.setName(req.name);
        goal.setDescription(req.description);
        goal.setTargetAmount(req.targetAmount);
        if (req.currentAmount != null) goal.setCurrentAmount(req.currentAmount);
        goal.setTargetDate(req.targetDate);
        if (req.status != null) goal.setStatus(req.status);
        goal.setIcon(req.icon);
        goal.setColor(req.color);
        return toResponse(savingsGoalRepository.save(goal));
    }

    public SavingsGoalResponse addFunds(String userId, String id, BigDecimal amount) {
        SavingsGoal goal = find(userId, id);
        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));
        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(SavingsGoal.GoalStatus.COMPLETED);
        }
        return toResponse(savingsGoalRepository.save(goal));
    }

    public void delete(String userId, String id) {
        savingsGoalRepository.delete(find(userId, id));
    }

    private SavingsGoal find(String userId, String id) {
        return savingsGoalRepository.findById(id)
                .filter(g -> g.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("SavingsGoal", id));
    }

    private SavingsGoalResponse toResponse(SavingsGoal g) {
        BigDecimal remaining = g.getTargetAmount().subtract(g.getCurrentAmount());
        double pct = g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                ? g.getCurrentAmount().divide(g.getTargetAmount(), 4, RoundingMode.HALF_UP)
                  .multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0;
        long days = ChronoUnit.DAYS.between(LocalDate.now(), g.getTargetDate());

        return SavingsGoalResponse.builder()
                .id(g.getId())
                .name(g.getName())
                .description(g.getDescription())
                .targetAmount(g.getTargetAmount())
                .currentAmount(g.getCurrentAmount())
                .progressPercentage(Math.min(pct, 100))
                .remainingAmount(remaining.max(BigDecimal.ZERO))
                .targetDate(g.getTargetDate())
                .status(g.getStatus())
                .icon(g.getIcon())
                .color(g.getColor())
                .daysRemaining(Math.max(days, 0))
                .createdAt(g.getCreatedAt())
                .build();
    }
}
