package com.fintrack.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    
    private String email;
    private String name;
    private String googleId;
    
    // "INDIVIDUAL" or "ORGANIZATION"
    private String accountType;
    
    public User() {}

    public User(String email, String name, String googleId, String accountType) {
        this.email = email;
        this.name = name;
        this.googleId = googleId;
        this.accountType = accountType;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
}
