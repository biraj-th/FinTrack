package com.financetracker.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String title;
    private String description;

    private BigDecimal amount;

    @Indexed
    private TransactionType type;

    @Indexed
    private String category;

    @Indexed
    private LocalDate date;

    private String paymentMethod;
    private String reference;
    private String tags;

    @Builder.Default
    private boolean recurring = false;
    private RecurringPeriod recurringPeriod;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum TransactionType {
        INCOME, EXPENSE, TRANSFER, INVESTMENT
    }

    public enum RecurringPeriod {
        DAILY, WEEKLY, MONTHLY, YEARLY
    }
}
