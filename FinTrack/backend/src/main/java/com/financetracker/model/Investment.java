package com.financetracker.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "investments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Investment {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String name;
    private String ticker;
    private InvestmentType type;

    private BigDecimal purchasePrice;
    private BigDecimal currentPrice;
    private BigDecimal quantity;

    private LocalDate purchaseDate;
    private String broker;
    private String notes;
    private String sector;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum InvestmentType {
        STOCK, ETF, CRYPTO, MUTUAL_FUND, BOND, REAL_ESTATE, COMMODITY, OTHER
    }
}
