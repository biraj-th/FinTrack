package com.financetracker.dto;
import com.financetracker.model.Investment;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class InvestmentResponse {
    private String id;
    private String name;
    private String ticker;
    private Investment.InvestmentType type;
    private BigDecimal purchasePrice;
    private BigDecimal currentPrice;
    private BigDecimal quantity;
    private BigDecimal totalCost;
    private BigDecimal currentValue;
    private BigDecimal gainLoss;
    private double gainLossPercent;
    private LocalDate purchaseDate;
    private String broker;
    private String notes;
    private String sector;
    private LocalDateTime createdAt;
}
