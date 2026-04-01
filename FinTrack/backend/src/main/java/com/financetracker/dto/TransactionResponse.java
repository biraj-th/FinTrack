package com.financetracker.dto;
import com.financetracker.model.Transaction;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class TransactionResponse {
    private String id;
    private String title;
    private String description;
    private BigDecimal amount;
    private Transaction.TransactionType type;
    private String category;
    private LocalDate date;
    private String paymentMethod;
    private String reference;
    private String tags;
    private boolean recurring;
    private Transaction.RecurringPeriod recurringPeriod;
    private LocalDateTime createdAt;
}
