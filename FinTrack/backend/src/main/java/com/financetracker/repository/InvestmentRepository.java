package com.financetracker.repository;

import com.financetracker.model.Investment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InvestmentRepository extends MongoRepository<Investment, String> {
    List<Investment> findByUserId(String userId);
    List<Investment> findByUserIdAndType(String userId, Investment.InvestmentType type);
}
