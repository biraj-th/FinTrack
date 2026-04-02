# 🧪 FinTrack — Testing Documentation

> **Date:** April 2, 2026  
> **Tester:** Biraj Thapa  
> **Environment:** Windows, Node.js 18+, Java 21, Python 3.x  

---

## 📋 Test Summary

| Category | Total Tests | Passed | Failed | Pass Rate |
|----------|------------|--------|--------|-----------|
| Frontend | 15 | 15 | 0 | ✅ 100% |
| Backend | 9 | 9 | 0 | ✅ 100% |
| AI Service | 5 | 5 | 0 | ✅ 100% |
| Integration | 4 | 4 | 0 | ✅ 100% |
| Code Quality | 4 | 4 | 0 | ✅ 100% |
| **Total** | **37** | **37** | **0** | **✅ 100%** |

---

## 🎨 Frontend Test Cases

### Navigation & Routing

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-F01 | Landing page loads | Navigate to `http://localhost:5173/` | Landing page displays with logo, title, and buttons | Landing page renders correctly | ✅ Pass |
| TC-F02 | Get Started navigation | Click "Get Started" on Landing | Redirects to `/register` | Redirects correctly | ✅ Pass |
| TC-F03 | Login link navigation | Click "Login Here" on Landing | Redirects to `/login` | Redirects correctly | ✅ Pass |
| TC-F14 | Invalid route handling | Navigate to `/invalid-page` | Redirects to Landing page (`/`) | Redirects correctly | ✅ Pass |

### Registration Page

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-F04 | Form field validation | Submit form with empty fields | Browser blocks submission, shows required field warnings | Validation works | ✅ Pass |
| TC-F05 | Successful registration | Fill Name, Email, Password and submit | Stores name in localStorage, redirects to `/login` | Works as expected | ✅ Pass |

### Login Page

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-F06 | Form field validation | Submit login form with empty fields | Browser blocks submission | Validation works | ✅ Pass |
| TC-F07 | Successful login | Enter email & password, submit | Redirects to `/dashboard` | Redirects correctly | ✅ Pass |

### Dashboard

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-F08 | Dynamic user greeting | Register as "Biraj", login, view Dashboard | Shows "Welcome back, Biraj." | Displays correct name | ✅ Pass |
| TC-F09 | Financial summary cards | View Dashboard | Total Balance, Income, Expenses cards visible | Cards render correctly | ✅ Pass |
| TC-F10 | Add transaction | Fill "Add New Record" form, click Save | Transaction appears in Recent Transactions list | Transaction added | ✅ Pass |
| TC-F11 | Income display | Add an INCOME transaction | Displayed in green with `+` prefix | Correct styling | ✅ Pass |
| TC-F12 | Expense display | Add an EXPENSE transaction | Displayed in red with `-` prefix | Correct styling | ✅ Pass |

### UI & Styling

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-F13 | Responsive layout | Resize browser window | Layout adapts, no horizontal overflow | Responsive design works | ✅ Pass |
| TC-F15 | Glassmorphism theme | View all pages | Dark background, glass panels, correct colors | Premium styling renders | ✅ Pass |

---

## ⚙️ Backend Test Cases

### Application Startup

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-B01 | Server starts | Run `.\mvnw spring-boot:run` | Application starts on port 8080 without errors | Starts successfully | ✅ Pass |
| TC-B05 | MongoDB connection | Start backend with Atlas URI configured | Connection to MongoDB Atlas established | Connected successfully | ✅ Pass |

### REST API Endpoints

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-B02 | GET transactions | `GET http://localhost:8080/api/transactions` | Returns JSON array of transactions | Returns `[]` or populated list | ✅ Pass |
| TC-B03 | POST transaction | `POST http://localhost:8080/api/transactions` with valid JSON body | Returns created transaction with auto-generated ID | Transaction created | ✅ Pass |
| TC-B04 | Auto-set date | Create a transaction without providing date | `date` field automatically set to current timestamp | Date auto-populated | ✅ Pass |

### Security & Configuration

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-B06 | CORS configuration | Send API request from `http://localhost:5173` | Request allowed, no CORS error | CORS configured correctly | ✅ Pass |
| TC-B07 | API access in dev mode | Access `/api/transactions` without OAuth2 login | Request permitted (dev mode) | Accessible | ✅ Pass |

### Data Models

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-B08 | Transaction model | POST a transaction and verify in MongoDB | Fields: id, userId, amount, category, description, type, date | All fields stored | ✅ Pass |
| TC-B09 | User model | Verify User model structure | Fields: id, email, name, googleId, accountType | Model correct | ✅ Pass |

---

## 🤖 AI Service Test Cases

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-A01 | Health check | `GET http://localhost:8000/` | Returns `{"message": "FinTrack AI Prediction Engine is running"}` | Correct response | ✅ Pass |
| TC-A02 | Prediction endpoint | `POST http://localhost:8000/predict` with transactions | Returns prediction JSON with insights | Prediction returned | ✅ Pass |
| TC-A03 | 5% projection | Send expenses totaling $1000 | `predicted_next_month_expenses` = $1050.00 | Correct calculation | ✅ Pass |
| TC-A04 | Budget buffer | Send expenses totaling $1000 | `suggested_budget` = $1155.00 (10% buffer) | Correct calculation | ✅ Pass |
| TC-A05 | Zero expenses | Send request with only INCOME transactions | No division by zero error, returns $0 prediction | Handled gracefully | ✅ Pass |

---

## 🔗 Integration Test Cases

| ID | Test Case | Steps | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-I01 | Frontend → Backend | Submit transaction from Dashboard form | Data sent to backend API and stored in MongoDB | Communication works | ✅ Pass |
| TC-I02 | Full user flow | Register → Login → Dashboard → Add Transaction | Complete flow works end-to-end | All steps successful | ✅ Pass |
| TC-I03 | Data persistence | Add transaction, refresh page, verify in MongoDB Atlas | Data persists in cloud database | Data persisted | ✅ Pass |
| TC-I04 | Concurrent services | Start all 3 services simultaneously | Frontend (5173), Backend (8080), AI (8000) — no port conflicts | All services running | ✅ Pass |

---

## 🧹 Code Quality Checks

| ID | Check | Description | Status |
|----|-------|-------------|--------|
| CQ-01 | Unused imports | No unused imports in Java source files | ✅ Pass |
| CQ-02 | CSS compatibility | All vendor-prefixed CSS properties have standard equivalents | ✅ Pass |
| CQ-03 | ESLint | No ESLint errors or warnings in React components | ✅ Pass |
| CQ-04 | Credential safety | `application.properties` excluded from Git via `.gitignore` | ✅ Pass |

---

## 🐛 Known Issues & Resolutions

| Issue | Root Cause | Resolution | Status |
|-------|-----------|------------|--------|
| Hardcoded "Alex" on Dashboard | Name was hardcoded in `Dashboard.jsx` | Replaced with dynamic `localStorage.getItem('userName')` | ✅ Resolved |
| API blocked by Spring Security | `requestMatchers` only allowed `/api/public/**` | Updated to allow `/api/**` for dev mode | ✅ Resolved |
| Unused import warning in `User.java` | `java.util.List` imported but not used | Removed unused import | ✅ Resolved |
| CSS compatibility warning | Missing standard `background-clip` property | Added `background-clip: text` alongside `-webkit-background-clip` | ✅ Resolved |
| MongoDB credentials in Git | `application.properties` was being tracked | Added to `.gitignore` and removed from Git cache | ✅ Resolved |

---

## 📝 Test Environment Details

| Component | Details |
|-----------|---------|
| **OS** | Windows |
| **Browser** | Chrome/Edge (latest) |
| **Node.js** | v18+ |
| **Java** | JDK 21 |
| **Python** | 3.x |
| **Database** | MongoDB Atlas (Cluster0) |
| **IDE** | Visual Studio Code |

---

<p align="center">
  📊 <strong>All 37 tests passed with a 100% pass rate.</strong>
</p>
