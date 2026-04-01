package com.financetracker.repository;

import com.financetracker.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    Page<Transaction> findByUserIdOrderByDateDesc(String userId, Pageable pageable);
    List<Transaction> findByUserIdOrderByDateDesc(String userId);
    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(String userId, LocalDate start, LocalDate end);
    List<Transaction> findByUserIdAndTypeAndDateBetween(String userId, Transaction.TransactionType type, LocalDate start, LocalDate end);
    List<Transaction> findByUserIdAndCategoryAndDateBetween(String userId, String category, LocalDate start, LocalDate end);
    long countByUserId(String userId);
}
