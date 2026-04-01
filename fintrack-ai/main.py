from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="FinTrack AI Prediction Service")

class Transaction(BaseModel):
    category: str
    amount: float
    type: str # INCOME or EXPENSE

class PredictionRequest(BaseModel):
    user_id: str
    transactions: List[Transaction]

@app.get("/")
def read_root():
    return {"message": "FinTrack AI Prediction Engine is running"}

@app.post("/predict")
def predict_budget(request: PredictionRequest):
    # Mocking a prediction algorithm (like Scikit-learn LinearRegression or Arima)
    total_spent = sum([t.amount for t in request.transactions if t.type == 'EXPENSE'])
    num_expense_transactions = sum(1 for t in request.transactions if t.type == 'EXPENSE')
    avg_expense = total_spent / num_expense_transactions if num_expense_transactions > 0 else 0
    
    # Advanced logic placeholder
    predicted_next_month = total_spent * 1.05 # Assume 5% inflation/increase
    
    return {
        "user_id": request.user_id,
        "prediction_insight": "Based on your spending patterns, we predict a 5% increase in base living costs.",
        "predicted_next_month_expenses": round(predicted_next_month, 2),
        "suggested_budget": round(predicted_next_month * 1.1, 2)
    }

# To run locally: uvicorn main:app --reload
