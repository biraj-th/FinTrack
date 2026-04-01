package com.financetracker.dto;
import com.financetracker.model.SavingsGoal;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class SavingsGoalRequest {
    @NotBlank public String name;
    public String description;
    @NotNull @DecimalMin("0.01") public BigDecimal targetAmount;
    public BigDecimal currentAmount = BigDecimal.ZERO;
    @NotNull public LocalDate targetDate;
    public SavingsGoal.GoalStatus status = SavingsGoal.GoalStatus.ACTIVE;
    public String icon;
    public String color;
}
