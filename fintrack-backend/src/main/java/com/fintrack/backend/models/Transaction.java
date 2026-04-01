package com.fintrack.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    private String userId;
    private Double amount;
    private String category;
    private String description;
    
    // "INCOME" or "EXPENSE"
    private String type; 
    
    private LocalDateTime date;

    public Transaction() {}

    public Transaction(String userId, Double amount, String category, String description, String type, LocalDateTime date) {
        this.userId = userId;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.type = type;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}
