package com.financetracker.service;

import com.financetracker.dto.*;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.model.Investment;
import com.financetracker.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;

    public List<InvestmentResponse> getAll(String userId) {
        return investmentRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public InvestmentResponse getById(String userId, String id) {
        return toResponse(find(userId, id));
    }

    public InvestmentResponse create(String userId, InvestmentRequest req) {
        Investment inv = Investment.builder()
                .userId(userId)
                .name(req.name)
                .ticker(req.ticker)
                .type(req.type)
                .purchasePrice(req.purchasePrice)
                .currentPrice(req.currentPrice)
                .quantity(req.quantity)
                .purchaseDate(req.purchaseDate)
                .broker(req.broker)
                .notes(req.notes)
                .sector(req.sector)
                .build();
        return toResponse(investmentRepository.save(inv));
    }

    public InvestmentResponse update(String userId, String id, InvestmentRequest req) {
        Investment inv = find(userId, id);
        inv.setName(req.name);
        inv.setTicker(req.ticker);
        inv.setType(req.type);
        inv.setPurchasePrice(req.purchasePrice);
        inv.setCurrentPrice(req.currentPrice);
        inv.setQuantity(req.quantity);
        inv.setPurchaseDate(req.purchaseDate);
        inv.setBroker(req.broker);
        inv.setNotes(req.notes);
        inv.setSector(req.sector);
        return toResponse(investmentRepository.save(inv));
    }

    public void delete(String userId, String id) {
        investmentRepository.delete(find(userId, id));
    }

    public PortfolioSummary getPortfolioSummary(String userId) {
        List<Investment> investments = investmentRepository.findByUserId(userId);

        BigDecimal totalCost = investments.stream()
                .map(i -> i.getPurchasePrice().multiply(i.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalValue = investments.stream()
                .map(i -> i.getCurrentPrice().multiply(i.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalGainLoss = totalValue.subtract(totalCost);
        double gainLossPct = totalCost.compareTo(BigDecimal.ZERO) > 0
                ? totalGainLoss.divide(totalCost, 4, RoundingMode.HALF_UP)
                  .multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0;

        // Type breakdown
        var typeBreakdown = investments.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        inv -> inv.getType().name(),
                        java.util.stream.Collectors.reducing(BigDecimal.ZERO,
                                i -> i.getCurrentPrice().multiply(i.getQuantity()),
                                BigDecimal::add)))
                .entrySet().stream()
                .map(e -> {
                    double pct = totalValue.compareTo(BigDecimal.ZERO) > 0
                            ? e.getValue().divide(totalValue, 4, RoundingMode.HALF_UP)
                              .multiply(BigDecimal.valueOf(100)).doubleValue()
                            : 0;
                    return new DashboardSummary.InvestmentSummary(e.getKey(), e.getValue(), pct);
                })
                .toList();

        return new PortfolioSummary(totalCost, totalValue, totalGainLoss, gainLossPct,
                investments.size(), typeBreakdown);
    }

    private Investment find(String userId, String id) {
        return investmentRepository.findById(id)
                .filter(i -> i.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Investment", id));
    }

    private InvestmentResponse toResponse(Investment inv) {
        BigDecimal totalCost = inv.getPurchasePrice().multiply(inv.getQuantity());
        BigDecimal currentValue = inv.getCurrentPrice().multiply(inv.getQuantity());
        BigDecimal gainLoss = currentValue.subtract(totalCost);
        double gainLossPct = totalCost.compareTo(BigDecimal.ZERO) > 0
                ? gainLoss.divide(totalCost, 4, RoundingMode.HALF_UP)
                  .multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0;

        return InvestmentResponse.builder()
                .id(inv.getId())
                .name(inv.getName())
                .ticker(inv.getTicker())
                .type(inv.getType())
                .purchasePrice(inv.getPurchasePrice())
                .currentPrice(inv.getCurrentPrice())
                .quantity(inv.getQuantity())
                .totalCost(totalCost)
                .currentValue(currentValue)
                .gainLoss(gainLoss)
                .gainLossPercent(gainLossPct)
                .purchaseDate(inv.getPurchaseDate())
                .broker(inv.getBroker())
                .notes(inv.getNotes())
                .sector(inv.getSector())
                .createdAt(inv.getCreatedAt())
                .build();
    }

    // Inner record for portfolio summary
    public record PortfolioSummary(
            BigDecimal totalCost,
            BigDecimal totalValue,
            BigDecimal totalGainLoss,
            double gainLossPercent,
            int holdingsCount,
            List<DashboardSummary.InvestmentSummary> typeBreakdown
    ) {}
}
