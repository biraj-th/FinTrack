package com.financetracker.repository;

import com.financetracker.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface BudgetRepository extends MongoRepository<Budget, String> {
    List<Budget> findByUserId(String userId);
    List<Budget> findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            String userId, LocalDate end, LocalDate start);
}
