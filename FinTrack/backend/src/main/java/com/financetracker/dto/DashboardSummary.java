package com.financetracker.dto;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class DashboardSummary {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
    private BigDecimal totalSavingsProgress;
    private BigDecimal totalInvestmentValue;
    private BigDecimal totalInvestmentGainLoss;
    private int transactionCount;
    private List<CategorySummary> topExpenseCategories;
    private List<MonthlyTrend> monthlyTrends;
    private List<InvestmentSummary> investmentBreakdown;

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class CategorySummary {
        private String category;
        private BigDecimal amount;
        private double percentage;
    }
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class MonthlyTrend {
        private String month;
        private BigDecimal income;
        private BigDecimal expenses;
    }
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class InvestmentSummary {
        private String type;
        private BigDecimal currentValue;
        private double percentage;
    }
}
