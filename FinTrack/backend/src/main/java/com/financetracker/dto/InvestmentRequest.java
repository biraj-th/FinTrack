package com.financetracker.dto;
import com.financetracker.model.Investment;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class InvestmentRequest {
    @NotBlank public String name;
    public String ticker;
    @NotNull public Investment.InvestmentType type;
    @NotNull @DecimalMin("0.01") public BigDecimal purchasePrice;
    @NotNull @DecimalMin("0.01") public BigDecimal currentPrice;
    @NotNull @DecimalMin("0.00001") public BigDecimal quantity;
    @NotNull public LocalDate purchaseDate;
    public String broker;
    public String notes;
    public String sector;
}
