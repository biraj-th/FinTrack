package com.financetracker.dto;
import com.financetracker.model.SavingsGoal;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class SavingsGoalResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private double progressPercentage;
    private BigDecimal remainingAmount;
    private LocalDate targetDate;
    private SavingsGoal.GoalStatus status;
    private String icon;
    private String color;
    private long daysRemaining;
    private LocalDateTime createdAt;
}
