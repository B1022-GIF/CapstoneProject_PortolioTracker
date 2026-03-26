# Investment Portfolio Tracker

A full-stack web application for tracking and analyzing investment portfolios. Built with **Node.js/Express** (backend), **React/Vite** (frontend), and **MongoDB** (database). Features JWT authentication, interactive charts, PDF/CSV export, email delivery, and a CI/CD pipeline via GitHub Actions.

> **GitHub Repository:** [B1022-GIF/CapstoneProject_PortolioTracker](https://github.com/B1022-GIF/CapstoneProject_PortolioTracker)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [High-Level Architecture Diagram](#high-level-architecture-diagram)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Backend Architecture](#backend-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Authentication Flow (JWT)](#authentication-flow-jwt)
9. [API Endpoints](#api-endpoints)
10. [Database Schema](#database-schema)
11. [Testing Strategy](#testing-strategy)
12. [CI/CD Pipeline](#cicd-pipeline)
13. [Setup Instructions](#setup-instructions)
14. [Environment Variables](#environment-variables)
15. [License](#license)

---

## Architecture Overview

The application follows a **three-tier architecture** with clear separation of concerns:

| Tier | Technology | Responsibility |
|------|-----------|----------------|
| **Presentation** | React 18, TailwindCSS, Recharts | User interface, charts, client-side routing |
| **Application** | Node.js, Express.js | REST API, business logic, authentication |
| **Data** | MongoDB, Mongoose ODM | Persistent storage, data modeling |

**Design Principles:**
- **MVC Pattern** on the backend — Models (Mongoose schemas), Controllers (business logic), Routes (endpoint definitions)
- **Component-Based Architecture** on the frontend — reusable React components with Context API for state management
- **Stateless Authentication** — JWT tokens with no server-side session storage
- **Service Layer** — dedicated services for market data, PDF generation, CSV export, and email delivery

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│                                                                     │
│  ┌─────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Login   │  │  Register    │  │ Dashboard  │  │ Investments  │  │
│  │  Page    │  │  Page        │  │ Page       │  │ Page         │  │
│  └────┬─────┘  └──────┬───────┘  └─────┬──────┘  └──────┬───────┘  │
│       │               │               │                │           │
│       └───────────┬───┘               └────────┬───────┘           │
│                   │                            │                   │
│            ┌──────▼──────┐           ┌─────────▼─────────┐         │
│            │ AuthContext  │           │   Axios Instance   │         │
│            │ (JWT State)  │           │ (Auto-attach JWT)  │         │
│            └──────────────┘           └─────────┬─────────┘         │
└─────────────────────────────────────────────────┼───────────────────┘
                                                  │
                                          HTTP (REST API)
                                          Port 5000
                                                  │
┌─────────────────────────────────────────────────┼───────────────────┐
│                     BACKEND (Express.js)        │                   │
│                                                 │                   │
│  ┌──────────────────────────────────────────────▼────────────────┐  │
│  │                     Middleware Layer                           │  │
│  │  ┌─────────┐  ┌──────────┐  ┌───────────────┐  ┌──────────┐ │  │
│  │  │  CORS   │  │  JSON    │  │  JWT Auth      │  │ Express  │ │  │
│  │  │         │  │  Parser  │  │  Middleware     │  │ Validator│ │  │
│  │  └─────────┘  └──────────┘  └───────────────┘  └──────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌────────────────────── Routes ──────────────────────────────────┐ │
│  │  /api/auth/*    /api/investments/*   /api/portfolio/*          │ │
│  │  /api/export/*  /api/health                                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────── Controllers ──────────────────────────────┐ │
│  │  authController    investmentController    portfolioController │ │
│  │  exportController                                             │ │
│  └──────────────────────────┬────────────────────────────────────┘ │
│                              │                                      │
│  ┌──────────────────── Services ─────────────────────────────────┐ │
│  │  marketData.js   pdfService.js   csvService.js   emailService │ │
│  │  (40+ assets)    (PDFKit)        (json2csv)      (Nodemailer) │ │
│  └──────────────────────────┬────────────────────────────────────┘ │
│                              │                                      │
│  ┌──────────────────── Models ───────────────────────────────────┐ │
│  │  User (name, email, password)                                 │ │
│  │  Investment (user, assetName, assetType, price, qty, ...)     │ │
│  └──────────────────────────┬────────────────────────────────────┘ │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                       Mongoose ODM
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                     MongoDB (port 27017)                            │
│                                                                     │
│    ┌───────────────┐         ┌──────────────────────┐              │
│    │  users         │         │  investments          │              │
│    │  collection    │◄────────│  collection           │              │
│    │                │  FK:    │  (user → ObjectId)    │              │
│    └───────────────┘  user   └──────────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | v22+ | Server-side JavaScript |
| **Backend Framework** | Express.js | 4.21 | REST API routing & middleware |
| **Database** | MongoDB | 7+ | NoSQL document store |
| **ODM** | Mongoose | 8.7 | Schema definition & validation |
| **Authentication** | JSON Web Token | 9.0 | Stateless authentication |
| **Password Hashing** | bcryptjs | 2.4 | Secure password storage |
| **Input Validation** | express-validator | 7.2 | Request body/param validation |
| **PDF Generation** | PDFKit | 0.15 | Portfolio PDF reports |
| **CSV Generation** | json2csv | 6.0 | Portfolio CSV exports |
| **Email** | Nodemailer | 6.9 | SMTP email with attachments |
| **Frontend Framework** | React | 18.3 | Component-based UI |
| **Build Tool** | Vite | 5.4 | Dev server & production bundler |
| **CSS Framework** | TailwindCSS | 3.4 | Utility-first CSS |
| **Charts** | Recharts | 2.12 | Pie & Line charts |
| **Routing** | React Router | 6.26 | Client-side navigation |
| **HTTP Client** | Axios | 1.7 | API communication |
| **Notifications** | React Hot Toast | 2.4 | User feedback toasts |
| **Backend Testing** | Jest + Supertest | 30.3 / 7.2 | Unit & integration tests |
| **Frontend Testing** | Vitest + React Testing Library | 4.1 / 16.3 | Component & unit tests |
| **CI/CD** | GitHub Actions | — | Automated test & security pipeline |

---

## Features

### Core Functionality
- **User Authentication** — Register and login with JWT-based auth (7-day token expiry)
- **Investment CRUD** — Add, view, edit, and delete investment entries
  - Supports 7 asset types: Equity, Debt, Mutual Fund, Crypto, ETF, Bonds, Other
  - Asset name, purchase date, purchase price, quantity, notes
  - Real-time current price via mock market data service

### Portfolio Dashboard
- **Summary Cards** — Total Invested, Current Value, Total Gain/Loss (%), Total Assets
- **Diversification Chart** — Pie chart showing allocation by asset class
- **Performance Chart** — 30-day historical portfolio value trend (line chart)
- **Gain/Loss Table** — Per-asset profit/loss breakdown, sortable
- **Filters** — Time range (1M/3M/6M/1Y/ALL), asset class, gainers vs. losers

### Export & Reporting
- **PDF Download** — Formatted portfolio report with summary, diversification, and investment details
- **CSV Download** — Tabular export of all investment data
- **Email Delivery** — Send PDF or CSV reports to any email address via SMTP

### Mock Market Data
- Simulated real-time prices for **40+ assets** including stocks (AAPL, GOOGL, RELIANCE, TCS), crypto (BTC, ETH), ETFs, mutual funds, and bonds
- `getPrice()`, `getHistoricalData()`, `getBulkPrices()` functions

---

## Project Structure

```
CAPSTONE_Project/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline (3 jobs)
├── .gitignore
├── README.md
│
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection via Mongoose
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, GetMe
│   │   ├── investmentController.js # CRUD operations for investments
│   │   ├── portfolioController.js  # Dashboard aggregation & analytics
│   │   └── exportController.js     # PDF, CSV download & email delivery
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── models/
│   │   ├── User.js                 # User schema (name, email, password)
│   │   └── Investment.js           # Investment schema with virtual fields
│   ├── routes/
│   │   ├── auth.js                 # /api/auth/*
│   │   ├── investments.js          # /api/investments/*
│   │   ├── portfolio.js            # /api/portfolio/*
│   │   └── export.js               # /api/export/*
│   ├── services/
│   │   ├── marketData.js           # Mock market data (40+ assets)
│   │   ├── pdfService.js           # PDF generation (PDFKit)
│   │   ├── csvService.js           # CSV generation (json2csv)
│   │   └── emailService.js         # Email delivery (Nodemailer)
│   ├── utils/
│   │   └── helpers.js              # Shared utility functions
│   ├── tests/
│   │   ├── setup.js                # Jest setup: DB connect, cleanup, teardown
│   │   ├── auth.test.js            # Auth endpoint tests (9 tests)
│   │   ├── investment.test.js      # Investment CRUD tests
│   │   ├── portfolio.test.js       # Dashboard endpoint tests
│   │   └── unit.test.js            # Unit tests for helpers/services
│   ├── server.js                   # Express app entry point
│   ├── .env                        # Environment variables (not in git)
│   └── package.json
│
└── frontend/
    ├── index.html                  # HTML entry point
    ├── vite.config.js              # Vite config + test config (jsdom)
    ├── tailwind.config.js          # TailwindCSS configuration
    ├── postcss.config.js           # PostCSS plugins
    ├── src/
    │   ├── main.jsx                # React entry point (AuthProvider wrapper)
    │   ├── App.jsx                 # Route definitions & layout
    │   ├── index.css               # Global styles + Tailwind directives
    │   ├── api/
    │   │   └── axios.js            # Axios instance with JWT interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx     # Auth state management (login/register/logout)
    │   ├── pages/
    │   │   ├── Login.jsx           # Login form page
    │   │   ├── Register.jsx        # Registration form page
    │   │   ├── DashboardPage.jsx   # Portfolio analytics dashboard
    │   │   └── InvestmentsPage.jsx # Investment CRUD table + form
    │   ├── components/
    │   │   ├── Navbar.jsx          # Navigation bar with auth-aware links
    │   │   ├── ProtectedRoute.jsx  # Route guard (redirects to /login)
    │   │   ├── PortfolioSummary.jsx # 4 summary cards (invested, value, gain, assets)
    │   │   ├── DiversificationChart.jsx # Pie chart (allocation by asset type)
    │   │   ├── PerformanceChart.jsx    # Line chart (30-day trend)
    │   │   ├── GainLossTable.jsx       # Per-asset gain/loss table
    │   │   ├── InvestmentTable.jsx     # Full investment data table
    │   │   ├── InvestmentForm.jsx      # Add/edit investment form
    │   │   ├── Filters.jsx            # Dashboard filter controls
    │   │   └── ExportActions.jsx      # PDF/CSV download & email buttons
    │   ├── utils/
    │   │   └── format.js           # formatCurrency, formatPercent, formatDate
    │   └── tests/
    │       ├── setup.js            # Vitest setup (jest-dom matchers)
    │       ├── format.test.js      # Utility function unit tests
    │       ├── components.test.jsx # Component render & interaction tests
    │       └── form.test.jsx       # InvestmentForm tests
    └── package.json
```

---

## Backend Architecture

The backend follows the **MVC + Service Layer** pattern:

```
Request → Route → Middleware (JWT) → Controller → Service / Model → Response
```

### Layer Breakdown

| Layer | Files | Responsibility |
|-------|-------|----------------|
| **Routes** | `routes/*.js` | Map HTTP methods + URLs to controller functions, apply middleware |
| **Middleware** | `middleware/auth.js` | Extract & verify JWT from `Authorization: Bearer <token>` header, attach `req.user` |
| **Controllers** | `controllers/*.js` | Handle request/response, invoke services, return JSON |
| **Services** | `services/*.js` | Business logic: market data lookups, PDF/CSV generation, email sending |
| **Models** | `models/*.js` | Mongoose schemas with validation, virtuals, and methods |
| **Config** | `config/db.js` | MongoDB connection setup |

### Request Flow Example — "Get Dashboard"

```
GET /api/portfolio/dashboard?timeRange=3M&assetType=Equity&filter=gainers
  │
  ├─ auth middleware: verify JWT → attach req.user
  │
  ├─ portfolioController.getDashboard():
  │   ├─ Query investments for req.user.id
  │   ├─ Call marketData.getBulkPrices() to update current prices
  │   ├─ Calculate: totalInvested, totalCurrentValue, totalGainLoss
  │   ├─ Aggregate diversification by assetType
  │   ├─ Apply filters (timeRange, assetType, gainers/losers)
  │   ├─ Generate 30-day historical performance data
  │   └─ Return { summary, investments, diversification, historicalPerformance }
  │
  └─ Response: 200 OK { summary, investments, diversification, historicalPerformance }
```

---

## Frontend Architecture

The frontend uses a **component-based architecture** with React Context for global state:

```
main.jsx
  └─ AuthProvider (Context)
       └─ App.jsx (Router)
            ├─ /login        → Login Page
            ├─ /register     → Register Page
            ├─ /dashboard    → ProtectedRoute → DashboardPage
            │                    ├─ PortfolioSummary (4 cards)
            │                    ├─ Filters (time, type, gain)
            │                    ├─ DiversificationChart (Pie)
            │                    ├─ PerformanceChart (Line)
            │                    ├─ GainLossTable
            │                    └─ ExportActions (PDF/CSV/Email)
            └─ /investments  → ProtectedRoute → InvestmentsPage
                                 ├─ InvestmentForm (Add/Edit)
                                 └─ InvestmentTable (List + CRUD)
```

### State Management

| Concern | Approach |
|---------|----------|
| **Authentication** | `AuthContext` — stores `user` object + `token` in React state & `localStorage` |
| **Dashboard Data** | Local state in `DashboardPage` — fetched on mount and filter change |
| **Investment List** | Local state in `InvestmentsPage` — fetched on mount, updated after CRUD |
| **API Communication** | Centralized `axios.js` instance with request interceptor (auto-attach JWT) and response interceptor (handle 401 → redirect to login) |

### Component Responsibilities

| Component | Type | Purpose |
|-----------|------|---------|
| `Navbar` | Layout | Global navigation, shows user name, logout button |
| `ProtectedRoute` | HOC | Redirects unauthenticated users to `/login` |
| `PortfolioSummary` | Display | Renders 4 metric cards with `formatCurrency` / `formatPercent` |
| `DiversificationChart` | Chart | Recharts `PieChart` — portfolio allocation by asset type |
| `PerformanceChart` | Chart | Recharts `LineChart` — 30-day portfolio value trend |
| `GainLossTable` | Table | Per-asset gain/loss sorted by return %, color-coded |
| `Filters` | Control | Dropdown & button controls for dashboard filtering |
| `InvestmentTable` | Table | All investments with edit/delete actions |
| `InvestmentForm` | Form | Controlled form for add/edit with 6 fields + validation |
| `ExportActions` | Action | Buttons for PDF/CSV download + email modal |

---

## Authentication Flow (JWT)

```
┌──────────┐                          ┌──────────────┐                    ┌──────────┐
│  Client  │                          │   Express    │                    │ MongoDB  │
│ (React)  │                          │   Server     │                    │          │
└────┬─────┘                          └──────┬───────┘                    └────┬─────┘
     │                                       │                                 │
     │  POST /api/auth/register              │                                 │
     │  { name, email, password }            │                                 │
     │ ─────────────────────────────────────►│                                 │
     │                                       │  Validate input                 │
     │                                       │  Hash password (bcrypt, 12)     │
     │                                       │  Save user ──────────────────►  │
     │                                       │              ◄──────────────── │
     │                                       │  Generate JWT (7d expiry)       │
     │  ◄─────────────────────────────────── │  { token, user }               │
     │                                       │                                 │
     │  Store in localStorage:               │                                 │
     │    token, user object                 │                                 │
     │                                       │                                 │
     │  GET /api/investments                 │                                 │
     │  Authorization: Bearer <token>        │                                 │
     │ ─────────────────────────────────────►│                                 │
     │                                       │  auth middleware:               │
     │                                       │    Extract token                │
     │                                       │    Verify JWT signature         │
     │                                       │    Fetch user from DB  ───────► │
     │                                       │                       ◄─────── │
     │                                       │    Attach req.user              │
     │                                       │  Controller logic               │
     │  ◄─────────────────────────────────── │  Response data                 │
     │                                       │                                 │
     │  (If 401 response)                    │                                 │
     │  Axios interceptor:                   │                                 │
     │    Clear localStorage                 │                                 │
     │    Redirect → /login                  │                                 │
     │                                       │                                 │
```

**Key Details:**
- Passwords are hashed with **bcryptjs** (salt rounds: 12) before storage
- JWT payload contains `{ id: userId }`, signed with `JWT_SECRET`, expires in **7 days**
- Frontend Axios interceptor auto-attaches `Authorization: Bearer <token>` to every request
- On **401 response**, the interceptor clears localStorage and redirects to `/login`

---

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | `{ token, user }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| `GET` | `/api/auth/me` | — (requires JWT) | `{ user }` |

### Investments (Protected — requires JWT)

| Method | Endpoint | Body / Query | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/investments` | `?assetType=Equity&sortBy=purchaseDate&order=desc&search=AAPL` | `[ investment, ... ]` |
| `POST` | `/api/investments` | `{ assetName, assetType, purchaseDate, purchasePrice, quantity, notes }` | `{ investment }` |
| `GET` | `/api/investments/:id` | — | `{ investment }` |
| `PUT` | `/api/investments/:id` | `{ fields to update }` | `{ investment }` |
| `DELETE` | `/api/investments/:id` | — | `{ message }` |

### Portfolio (Protected)

| Method | Endpoint | Query | Response |
|--------|----------|-------|----------|
| `GET` | `/api/portfolio/dashboard` | `?timeRange=3M&assetType=Crypto&filter=gainers` | `{ summary, investments, diversification, historicalPerformance }` |

**Dashboard Response Structure:**
```json
{
  "summary": {
    "totalInvested": 50000,
    "totalCurrentValue": 62500,
    "totalGainLoss": 12500,
    "totalGainLossPercent": 25.0,
    "totalAssets": 8
  },
  "investments": [ ... ],
  "diversification": [
    { "_id": "Equity", "totalValue": 35000, "count": 5, "percentage": 56 }
  ],
  "historicalPerformance": [
    { "date": "2026-02-24", "value": 58000 },
    { "date": "2026-02-25", "value": 59200 }
  ]
}
```

### Export (Protected)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `GET` | `/api/export/pdf` | — | PDF file download |
| `GET` | `/api/export/csv` | — | CSV file download |
| `POST` | `/api/export/email/pdf` | `{ email }` (optional) | `{ message }` |
| `POST` | `/api/export/email/csv` | `{ email }` (optional) | `{ message }` |

### Health Check (Public)

| Method | Endpoint | Response |
|--------|----------|----------|
| `GET` | `/api/health` | `{ status: "OK", timestamp }` |

---

## Database Schema

### User Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | Required |
| `email` | String | Required, Unique, Lowercase |
| `password` | String | Required, Min 6 chars, Hashed (bcrypt) |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### Investment Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `user` | ObjectId | Required, FK → User |
| `assetName` | String | Required |
| `assetType` | String (Enum) | Equity, Debt, Mutual Fund, Crypto, ETF, Bonds, Other |
| `purchaseDate` | Date | Required |
| `purchasePrice` | Number | Required, Min 0 |
| `quantity` | Number | Required, Min 0 |
| `currentPrice` | Number | Default 0 |
| `notes` | String | Optional |
| `createdAt` | Date | Auto (timestamps) |

**Virtual Fields (computed, not stored):**

| Virtual | Formula |
|---------|---------|
| `investedAmount` | `purchasePrice × quantity` |
| `currentValue` | `currentPrice × quantity` |
| `gainLoss` | `currentValue − investedAmount` |
| `gainLossPercent` | `(gainLoss / investedAmount) × 100` |

---

## Testing Strategy

The project includes **81 automated tests** across two test suites:

### Backend — Jest + Supertest (51 tests)

Integration tests that run against a real MongoDB instance:

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `auth.test.js` | 9 | Registration (validation, duplicate email), Login (valid/invalid), GetMe (with/without token) |
| `investment.test.js` | ~20 | CRUD lifecycle, user data isolation, filtering, sorting, ownership verification |
| `portfolio.test.js` | ~12 | Dashboard aggregation, summary calculations, filter combinations, diversification |
| `unit.test.js` | ~10 | Helper utilities, service functions, edge cases |

**Test setup:** Connects to `mongodb://localhost:27017/portfolio_tracker_test`, clears collections between tests, drops the test database after completion.

### Frontend — Vitest + React Testing Library (30 tests)

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `format.test.js` | 12 | `formatCurrency`, `formatPercent`, `formatDate`, `gainLossClass` with edge cases |
| `components.test.jsx` | 10 | `PortfolioSummary` render, `InvestmentTable` interactions, empty states |
| `form.test.jsx` | 8 | `InvestmentForm` field rendering, add/edit modes, form submission |

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## CI/CD Pipeline

GitHub Actions workflow triggered on every **push** and **pull request** to `main`:

```
┌─────────────────────────────────────────────────────────┐
│                    CI Pipeline                           │
│                    (GitHub Actions)                       │
│                                                         │
│   ┌─────────────────┐  ┌────────────────┐  ┌─────────┐│
│   │  Backend Tests   │  │ Frontend Tests │  │  Lint & ││
│   │                  │  │                │  │ Security ││
│   │ • Ubuntu         │  │ • Ubuntu       │  │          ││
│   │ • Node.js 22     │  │ • Node.js 22   │  │ • Node  ││
│   │ • MongoDB 7.0    │  │ • npm install  │  │   22    ││
│   │   (service)      │  │ • vitest run   │  │ • npm   ││
│   │ • npm install    │  │ • vite build   │  │   audit ││
│   │ • jest           │  │                │  │  (both) ││
│   │                  │  │                │  │         ││
│   │  ✅ 51 tests     │  │  ✅ 30 tests   │  │ ✅ Scan ││
│   └─────────────────┘  └────────────────┘  └─────────┘│
│                                                         │
│   All 3 jobs run in parallel on every push/PR           │
└─────────────────────────────────────────────────────────┘
```

| Job | Environment | What It Validates |
|-----|-------------|-------------------|
| **Backend Tests** | Ubuntu + MongoDB 7 service container + Node 22 | All 51 backend tests pass against a real MongoDB instance |
| **Frontend Tests** | Ubuntu + Node 22 | All 30 frontend tests pass + production build (`vite build`) succeeds |
| **Lint & Security** | Ubuntu + Node 22 | `npm audit` on both backend and frontend for known vulnerabilities |

---

## Setup Instructions

### Prerequisites

- **Node.js** v22+ ([download](https://nodejs.org))
- **MongoDB** v7+ running locally or a MongoDB Atlas connection string
- **npm** (included with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/B1022-GIF/CapstoneProject_PortolioTracker.git
cd CapstoneProject_PortolioTracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below), then:

```bash
npm run dev      # Start with nodemon (hot reload)
# or
npm start        # Start normally
```

The API starts on **http://localhost:5000** — verify with `GET /api/health`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The UI starts on **http://localhost:3000** and proxies API requests to the backend.

### 4. Open in Browser

Navigate to **http://localhost:3000** → Register a new account → Start tracking investments!

---

## Environment Variables

Create `backend/.env` with the following:

```env
# Database
MONGO_URI=mongodb://localhost:27017/portfolio_tracker

# Authentication
JWT_SECRET=your_jwt_secret_key_change_in_production

# Server
PORT=5000

# Email Service (Nodemailer) — optional, needed for email export
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Gmail Setup for Email Export:**
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the generated app password as `EMAIL_PASS`

---

## License

MIT
