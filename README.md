# Stock Market API

Enterprise-grade Node.js backend for stock market data management.

## 🏗️ Architecture

```
StockAPI/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server startup & cron jobs
│   ├── config/                   # Configuration files
│   │   ├── index.js              # App configuration
│   │   └── database.js           # Database connection
│   ├── routes/                   # API routes
│   │   ├── stock.routes.js      # Stock endpoints
│   │   ├── admin.routes.js      # Admin endpoints
│   │   └── auth.routes.js       # Authentication endpoints
│   ├── controllers/             # Request handlers
│   │   ├── stock.controller.js  # Stock operations
│   │   ├── admin.controller.js  # Admin operations
│   │   └── auth.controller.js   # Authentication
│   ├── services/                 # Business logic
│   │   ├── scraper.service.js   # Web scraping
│   │   └── stockDatabase.service.js # Database operations
│   ├── models/                   # Mongoose models
│   │   ├── User.model.js        # User schema
│   │   ├── Stock.model.js       # Stock schema
│   │   └── AdminFormField.model.js # Form config schema
│   ├── middleware/              # Express middleware
│   │   ├── auth.middleware.js   # JWT authentication
│   │   ├── admin.middleware.js  # Admin role check
│   │   ├── csrf.middleware.js   # CSRF protection
│   │   └── errorHandler.middleware.js # Error handling
│   ├── utils/                    # Utility functions
│   │   ├── jwt.js               # JWT token management
│   │   └── response.js          # Standardized responses
│   └── scripts/                  # Utility scripts
│       └── createAdmin.js       # Create admin user
└── data/                        # Data storage (JSON files)
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/stockmarket
JWT_SECRET=your-secret-key-min-32-chars
CSRF_SECRET=your-csrf-secret
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
BENZINGA_URL=https://www.benzinga.com/premarket
CRON_SCHEDULE=*/5 * * * *
```

### 3. Start Server
```bash
npm start
```

### 4. Create Admin User
```bash
npm run create-admin
```

## 📡 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/stocks/home` - Get all stocks (gainers + losers)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/signup` - Admin signup
- `GET /api/auth/csrf-token` - Get CSRF token

### Protected Admin Endpoints
- `GET /api/admin/stocks` - Get all stocks (with filters)
- `POST /api/admin/stocks` - Create/update stock
- `DELETE /api/admin/stocks/:symbol` - Delete stock
- `GET /api/admin/form-data` - Get form configuration
- `POST /api/admin/form-data/update` - Update form configuration

## 🔐 Authentication

All admin endpoints require:
- `Authorization: Bearer <accessToken>` header
- `X-CSRF-Token: <csrfToken>` header (for POST/PUT/DELETE)

## 📊 Database

Uses MongoDB with Mongoose ODM. Collections:
- `users` - Admin users
- `stocks` - Stock data
- `adminformfields` - Form configuration

## 🛠️ Features

- ✅ JWT Authentication
- ✅ CSRF Protection
- ✅ Role-based Access Control
- ✅ Automated Stock Scraping (Cron)
- ✅ Database Integration
- ✅ Error Handling
- ✅ Request Validation

