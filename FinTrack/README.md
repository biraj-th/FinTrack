# 💰 FinTrack — Full-Stack Finance Tracking System

> React + Tailwind CSS frontend · Java Spring Boot backend · MongoDB database

---

## 📁 Project Structure

```
FinTrack/
│
├── 📄 README.md                    ← You are here
├── 📄 .gitignore
│
├── 🖥️  frontend/                   ← React + Tailwind CSS (Vite)
│   ├── index.html                  ← App entry point (loads fonts)
│   ├── package.json                ← Dependencies
│   ├── vite.config.js              ← Dev server + API proxy
│   ├── tailwind.config.js          ← Custom fonts, colors, animations
│   ├── postcss.config.js
│   │
│   └── src/
│       ├── main.jsx                ← ReactDOM root
│       ├── App.jsx                 ← Router + all routes
│       ├── index.css               ← Global styles + Tailwind layers
│       │
│       ├── 📂 pages/               ── Every screen in the app ──
│       │   ├── LandingPage.jsx     ← Intro page + "Let's start" CTA
│       │   ├── LoginPage.jsx       ← Sign in (JWT)
│       │   ├── RegisterPage.jsx    ← Create account + password strength
│       │   ├── ChatPage.jsx        ← AI finance assistant chat
│       │   ├── DashboardPage.jsx   ← Charts: income/expense/trends
│       │   ├── TransactionsPage.jsx← Full CRUD table + filters
│       │   ├── BudgetsPage.jsx     ← Budget cards + progress bars
│       │   ├── InvestmentsPage.jsx ← Portfolio tracker + pie chart
│       │   └── SavingsPage.jsx     ← Savings goals + add-funds
│       │
│       ├── 📂 components/          ── Reusable building blocks ──
│       │   ├── layout/
│       │   │   └── Layout.jsx      ← Sidebar + mobile nav wrapper
│       │   └── ui/
│       │       └── index.jsx       ← Modal, StatCard, ProgressBar,
│       │                               Badge, Field, EmptyState, etc.
│       │
│       ├── 📂 api/                 ── Backend communication ──
│       │   └── client.js           ← Axios + JWT interceptors
│       │                               (auth, transactions, budgets,
│       │                                investments, savings-goals)
│       │
│       ├── 📂 context/             ── Global state ──
│       │   └── AuthContext.jsx     ← Login / register / logout state
│       │
│       └── 📂 utils/               ── Helpers & constants ──
│           └── helpers.js          ← Currency formatter, date format,
│                                       category lists, color maps
│
└── ☕ backend/                      ← Java 17 + Spring Boot 3 + MongoDB
    ├── pom.xml                      ← Maven dependencies
    │
    └── src/main/
        ├── resources/
        │   └── application.properties   ← DB URI, JWT secret, CORS
        │
        └── java/com/financetracker/
            │
            ├── FinanceTrackerApplication.java   ← Main entry point
            │
            ├── 📂 model/            ── MongoDB documents ──
            │   ├── User.java
            │   ├── Transaction.java
            │   ├── Budget.java
            │   ├── Investment.java
            │   └── SavingsGoal.java
            │
            ├── 📂 repository/       ── Data access layer ──
            │   ├── UserRepository.java
            │   ├── TransactionRepository.java
            │   ├── BudgetRepository.java
            │   ├── InvestmentRepository.java
            │   └── SavingsGoalRepository.java
            │
            ├── 📂 service/          ── Business logic ──
            │   ├── TransactionService.java
            │   ├── BudgetService.java
            │   ├── InvestmentService.java
            │   └── SavingsGoalService.java
            │
            ├── 📂 controller/       ── REST API endpoints ──
            │   ├── AuthController.java         POST /auth/register, /login
            │   ├── TransactionController.java  GET/POST/PUT/DELETE /transactions
            │   ├── BudgetController.java        GET/POST/PUT/DELETE /budgets
            │   ├── InvestmentController.java   GET/POST/PUT/DELETE /investments
            │   └── SavingsGoalController.java  GET/POST/PUT/DELETE /savings-goals
            │
            ├── 📂 dto/              ── Request & response shapes ──
            │   ├── RegisterRequest.java / LoginRequest.java / AuthResponse.java
            │   ├── TransactionRequest.java / TransactionResponse.java
            │   ├── BudgetRequest.java / BudgetResponse.java
            │   ├── InvestmentRequest.java / InvestmentResponse.java
            │   ├── SavingsGoalRequest.java / SavingsGoalResponse.java
            │   ├── DashboardSummary.java
            │   └── ApiResponse.java            ← Standard {success, data, message}
            │
            ├── 📂 security/         ── JWT authentication ──
            │   ├── JwtUtils.java               ← Token generate/validate
            │   ├── JwtAuthFilter.java           ← Per-request auth filter
            │   └── UserDetailsServiceImpl.java
            │
            ├── 📂 config/           ── App configuration ──
            │   ├── SecurityConfig.java          ← CORS, auth rules, filters
            │   └── MongoConfig.java             ← Auditing + LocalDate converters
            │
            └── 📂 exception/        ── Error handling ──
                ├── GlobalExceptionHandler.java  ← 404, 400, 500 responses
                └── ResourceNotFoundException.java
```

---

## 🚀 Quick Start

### Prerequisites
| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MongoDB | 6+ |

---

### 1. Start MongoDB
```bash
# Local
mongod --dbpath /data/db

# Or use MongoDB Atlas — update application.properties with your URI
```

### 2. Configure Backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/finance_tracker

# ⚠️  Change this secret before going to production!
app.jwt.secret=FinanceTrackerSuperSecretKey2024!ChangeInProduction!MustBe256BitsLong!!
```

### 3. Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# API → http://localhost:8080/api
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
# App → http://localhost:5173
```

---

## 🌐 Page Routes

| URL | Page | Auth required |
|-----|------|:---:|
| `/` | Landing — intro + "Let's start" | No |
| `/login` | Sign in | No |
| `/register` | Create account | No |
| `/chat` | AI finance assistant | ✅ |
| `/dashboard` | Analytics overview | ✅ |
| `/dashboard/transactions` | Transaction CRUD | ✅ |
| `/dashboard/budgets` | Budget manager | ✅ |
| `/dashboard/investments` | Portfolio tracker | ✅ |
| `/dashboard/savings` | Savings goals | ✅ |

---

## 🔌 API Reference

### Auth  `POST /api/auth/...`
| Endpoint | Body |
|----------|------|
| `/register` | `{ fullName, email, password, currency }` |
| `/login`    | `{ email, password }` |

### Transactions  `/api/transactions`
`GET` · `POST` · `GET /:id` · `PUT /:id` · `DELETE /:id` · `GET /dashboard`

### Budgets  `/api/budgets`
`GET` · `POST` · `PUT /:id` · `DELETE /:id`

### Investments  `/api/investments`
`GET` · `GET /portfolio` · `POST` · `PUT /:id` · `DELETE /:id`

### Savings Goals  `/api/savings-goals`
`GET` · `POST` · `PUT /:id` · `POST /:id/add-funds` · `DELETE /:id`

All protected routes require: `Authorization: Bearer <token>`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP client | Axios |
| Display font | Syne (800) |
| Body font | DM Sans |
| Mono font | DM Mono |
| Backend | Java 17 + Spring Boot 3.2 |
| Database | MongoDB 6 |
| Auth | JWT (jjwt 0.11) |
| Security | Spring Security 6 |

---

## 📦 Production Build

```bash
# Frontend
cd frontend && npm run build   # output → frontend/dist/

# Backend
cd backend && mvn clean package -DskipTests
java -jar target/finance-tracker-backend-1.0.0.jar
```
