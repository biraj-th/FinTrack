package com.financetracker.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "budgets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Budget {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String category;
    private BigDecimal limitAmount;

    private LocalDate startDate;
    private LocalDate endDate;
    private BudgetPeriod period;

    private String color;
    private String icon;
    private String description;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum BudgetPeriod {
        WEEKLY, MONTHLY, QUARTERLY, YEARLY
    }
}
