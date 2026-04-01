package com.financetracker.repository;

import com.financetracker.model.SavingsGoal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SavingsGoalRepository extends MongoRepository<SavingsGoal, String> {
    List<SavingsGoal> findByUserId(String userId);
    List<SavingsGoal> findByUserIdAndStatus(String userId, SavingsGoal.GoalStatus status);
}
