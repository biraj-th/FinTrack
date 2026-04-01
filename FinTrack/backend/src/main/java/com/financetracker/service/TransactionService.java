package com.financetracker.service;

import com.financetracker.dto.*;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.model.Transaction;
import com.financetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Page<TransactionResponse> getAll(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        return transactionRepository.findByUserIdOrderByDateDesc(userId, pageable)
                .map(this::toResponse);
    }

    public TransactionResponse getById(String userId, String id) {
        Transaction t = transactionRepository.findById(id)
                .filter(tx -> tx.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        return toResponse(t);
    }

    public TransactionResponse create(String userId, TransactionRequest req) {
        Transaction t = Transaction.builder()
                .userId(userId)
                .title(req.title)
                .description(req.description)
                .amount(req.amount)
                .type(req.type)
                .category(req.category)
                .date(req.date)
                .paymentMethod(req.paymentMethod)
                .reference(req.reference)
                .tags(req.tags)
                .recurring(req.recurring)
                .recurringPeriod(req.recurringPeriod)
                .build();
        return toResponse(transactionRepository.save(t));
    }

    public TransactionResponse update(String userId, String id, TransactionRequest req) {
        Transaction t = transactionRepository.findById(id)
                .filter(tx -> tx.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));

        t.setTitle(req.title);
        t.setDescription(req.description);
        t.setAmount(req.amount);
        t.setType(req.type);
        t.setCategory(req.category);
        t.setDate(req.date);
        t.setPaymentMethod(req.paymentMethod);
        t.setReference(req.reference);
        t.setTags(req.tags);
        t.setRecurring(req.recurring);
        t.setRecurringPeriod(req.recurringPeriod);

        return toResponse(transactionRepository.save(t));
    }

    public void delete(String userId, String id) {
        Transaction t = transactionRepository.findById(id)
                .filter(tx -> tx.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        transactionRepository.delete(t);
    }

    public DashboardSummary getDashboard(String userId) {
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate sixMonthsAgo = now.minusMonths(5).withDayOfMonth(1);

        List<Transaction> allThisMonth = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, monthStart, now);

        BigDecimal income = sumByType(allThisMonth, Transaction.TransactionType.INCOME);
        BigDecimal expenses = sumByType(allThisMonth, Transaction.TransactionType.EXPENSE);
        BigDecimal net = income.subtract(expenses);
        long count = transactionRepository.countByUserId(userId);

        // Category breakdown
        List<DashboardSummary.CategorySummary> categories = allThisMonth.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)))
                .entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .limit(6)
                .map(e -> {
                    double pct = expenses.compareTo(BigDecimal.ZERO) > 0
                            ? e.getValue().divide(expenses, 4, RoundingMode.HALF_UP)
                              .multiply(BigDecimal.valueOf(100)).doubleValue()
                            : 0;
                    return new DashboardSummary.CategorySummary(e.getKey(), e.getValue(), pct);
                })
                .toList();

        // Monthly trends (last 6 months)
        List<Transaction> last6Months = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, sixMonthsAgo, now);

        Map<String, DashboardSummary.MonthlyTrend> trendMap = new LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate m = now.minusMonths(i);
            String key = m.getYear() + "-" + m.getMonthValue();
            String label = Month.of(m.getMonthValue())
                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + m.getYear();
            trendMap.put(key, new DashboardSummary.MonthlyTrend(label, BigDecimal.ZERO, BigDecimal.ZERO));
        }

        for (Transaction t : last6Months) {
            String key = t.getDate().getYear() + "-" + t.getDate().getMonthValue();
            if (trendMap.containsKey(key)) {
                DashboardSummary.MonthlyTrend trend = trendMap.get(key);
                if (t.getType() == Transaction.TransactionType.INCOME)
                    trend.setIncome(trend.getIncome().add(t.getAmount()));
                else if (t.getType() == Transaction.TransactionType.EXPENSE)
                    trend.setExpenses(trend.getExpenses().add(t.getAmount()));
            }
        }

        return DashboardSummary.builder()
                .totalIncome(income)
                .totalExpenses(expenses)
                .netBalance(net)
                .transactionCount((int) count)
                .topExpenseCategories(categories)
                .monthlyTrends(new ArrayList<>(trendMap.values()))
                .build();
    }

    private BigDecimal sumByType(List<Transaction> list, Transaction.TransactionType type) {
        return list.stream()
                .filter(t -> t.getType() == type)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .amount(t.getAmount())
                .type(t.getType())
                .category(t.getCategory())
                .date(t.getDate())
                .paymentMethod(t.getPaymentMethod())
                .reference(t.getReference())
                .tags(t.getTags())
                .recurring(t.isRecurring())
                .recurringPeriod(t.getRecurringPeriod())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
