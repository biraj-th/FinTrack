package com.financetracker.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "savings_goals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SavingsGoal {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String name;
    private String description;

    private BigDecimal targetAmount;

    @Builder.Default
    private BigDecimal currentAmount = BigDecimal.ZERO;

    private LocalDate targetDate;

    @Builder.Default
    private GoalStatus status = GoalStatus.ACTIVE;

    private String icon;
    private String color;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum GoalStatus {
        ACTIVE, COMPLETED, PAUSED, CANCELLED
    }
}
