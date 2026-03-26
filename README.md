# Investment Portfolio Tracker

A full-stack web application for tracking investment portfolios with real-time mock market data, interactive charts, and export capabilities.

## Tech Stack

### Backend
- **Node.js** + **Express.js** — REST API
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** — Authentication
- **PDFKit** — PDF generation
- **json2csv** — CSV generation
- **Nodemailer** — Email service

### Frontend
- **React 18** + **Vite** — UI framework & build tool
- **TailwindCSS** — Styling
- **Recharts** — Charts (Line, Pie)
- **React Router** — Client-side routing
- **Axios** — HTTP client
- **React Hot Toast** — Notifications
- **React Icons** — Icon library

## Features

- **User Authentication** — Register and login with JWT-based auth
- **Investment CRUD** — Add, view, update, and delete investment entries
  - Asset name, type, purchase date/price, quantity
  - Supports: Equity, Debt, Mutual Fund, Crypto, ETF, Bonds, Other
- **Portfolio Dashboard**
  - Total invested vs. current value summary cards
  - Gain/loss per asset with sorting
  - Diversification breakdown pie chart by asset class
  - 30-day historical performance line chart
  - Filters: time range, asset class, gainers/losers
- **Export**
  - Download portfolio summary as PDF or CSV
  - Send portfolio summary via email (PDF or CSV attachment)
- **Mock Market Data API** — Simulated real-time prices for stocks, mutual funds, crypto, ETFs, and bonds

## Prerequisites

- **Node.js** v18+ installed
- **MongoDB** running locally (default: `mongodb://localhost:27017`) or a MongoDB Atlas connection string
- **npm** or **yarn**

## Project Structure

```
CAPSTONE_Project/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/       # JWT auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # Market data, PDF, CSV, Email
│   ├── utils/            # Helper functions
│   ├── server.js         # Express app entry point
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/          # Axios instance
│   │   ├── components/   # React components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Formatting helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Clone / Navigate to Project

```bash
cd CAPSTONE_Project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` to configure your MongoDB connection string and email settings:

```env
MONGO_URI=mongodb://localhost:27017/portfolio_tracker
JWT_SECRET=your_strong_secret_key
PORT=5000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend:

```bash
npm run dev
```

The API will start on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000` and proxy API requests to the backend.

### 4. Open in Browser

Navigate to `http://localhost:3000` — register a new account and start tracking your investments!

## API Endpoints

### Auth
| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| POST   | /api/auth/register | Register user    |
| POST   | /api/auth/login    | Login user       |
| GET    | /api/auth/me       | Get current user |

### Investments
| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | /api/investments       | List all investments     |
| POST   | /api/investments       | Create investment        |
| GET    | /api/investments/:id   | Get single investment    |
| PUT    | /api/investments/:id   | Update investment        |
| DELETE | /api/investments/:id   | Delete investment        |

### Portfolio
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | /api/portfolio/dashboard | Get dashboard data   |

### Export
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | /api/export/pdf       | Download PDF              |
| GET    | /api/export/csv       | Download CSV              |
| POST   | /api/export/email/pdf | Email PDF attachment      |
| POST   | /api/export/email/csv | Email CSV attachment      |

## Email Configuration

To enable the email feature, configure your SMTP settings in `.env`. For Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the generated app password in `EMAIL_PASS`

## License

MIT
