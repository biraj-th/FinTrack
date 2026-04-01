package com.financetracker.dto;
import com.financetracker.model.Transaction;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class TransactionRequest {
    @NotBlank public String title;
    public String description;
    @NotNull @DecimalMin("0.01") public BigDecimal amount;
    @NotNull public Transaction.TransactionType type;
    @NotBlank public String category;
    @NotNull public LocalDate date;
    public String paymentMethod;
    public String reference;
    public String tags;
    public boolean recurring = false;
    public Transaction.RecurringPeriod recurringPeriod;
}
