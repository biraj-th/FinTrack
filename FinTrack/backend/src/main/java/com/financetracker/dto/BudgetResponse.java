package com.financetracker.dto;
import com.financetracker.model.Budget;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class BudgetResponse {
    private String id;
    private String category;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private double percentageUsed;
    private LocalDate startDate;
    private LocalDate endDate;
    private Budget.BudgetPeriod period;
    private String color;
    private String icon;
    private String description;
    private LocalDateTime createdAt;
}
