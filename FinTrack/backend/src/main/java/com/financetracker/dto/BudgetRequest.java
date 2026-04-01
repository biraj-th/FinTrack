package com.financetracker.dto;
import com.financetracker.model.Budget;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class BudgetRequest {
    @NotBlank public String category;
    @NotNull @DecimalMin("0.01") public BigDecimal limitAmount;
    @NotNull public LocalDate startDate;
    @NotNull public LocalDate endDate;
    public Budget.BudgetPeriod period;
    public String color;
    public String icon;
    public String description;
}
