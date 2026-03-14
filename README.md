# Inventory Management System

A comprehensive full-stack inventory management solution built with Next.js (frontend) and FastAPI (backend). Features real-time stock tracking, CSV import functionality, transaction management, and comprehensive dashboard visualization.

## 🎯 Features

- ✅ **Inventory Management**: CRUD operations for inventory items
- ✅ **Stock Status Tracking**: Three-level status system (In Stock, Low Stock, Out of Stock)
- ✅ **CSV Imports**: Bulk import both inventory items and transactions
- ✅ **Real-time Dashboard**: Analytics and visualizations with bar & line charts
- ✅ **Transaction Tracking**: Record restocks, sales, and adjustments
- ✅ **User Authentication**: JWT-based authentication with configurable token expiration
- ✅ **Dark Mode Support**: Light/dark theme toggle
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Comprehensive Testing**: 49+ tests covering all critical logic
- ✅ **Role-based Access**: Admin dashboard and inventory management

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit with RTK Query
- **Data Tables**: @tanstack/react-table
- **Charts**: Recharts 2.15.4
- **Form Handling**: React Hook Form
- **Testing**: Jest + React Testing Library

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MySQL 5.7+
- **ORM**: SQLAlchemy
- **Authentication**: PyJWT with bcrypt
- **CSV Processing**: Python csv module
- **File Upload**: python-multipart
- **Testing**: Pytest with pytest-cov

### Database
- **Type**: MySQL
- **Version**: 5.7+
- **Default Port**: 3306

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js**: v18+ (for frontend)
- **Python**: 3.9+ (for backend)
- **MySQL**: 5.7+ (database)
- **git**: For version control

### Recommended
- **Docker**: For containerized setup (optional)
- **Postman/Insomnia**: For API testing

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd tim-teknologi-global
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and settings
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your API configuration
```

### 4. Database Setup

```bash
# Create database
mysql -u root -p
```

```sql
CREATE DATABASE inventory_db;
USE inventory_db;
```

```bash
# Run migrations (from backend directory)
cd backend
python db/migrate.py

# Optional: Run seeder
python db/seeder.py
```

### 5. Run Applications

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
# Server running at http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running at http://localhost:4002
```

---

## 📁 Project Structure

```
tim-teknologi-global/
├── frontend/                          # Next.js application
│   ├── src/
│   │   ├── app/                      # Next.js app routes
│   │   ├── components/               # React components
│   │   ├── store/                    # Redux store & API slices
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utility functions
│   │   ├── constants/                # App constants
│   │   ├── types/                    # TypeScript types
│   │   └── __tests__/                # Frontend tests
│   ├── package.json
│   ├── jest.config.ts                # Jest configuration
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/                           # FastAPI application
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry
│   │   ├── database.py               # Database configuration
│   │   ├── models/                   # SQLAlchemy models
│   │   ├── controllers/              # Business logic
│   │   ├── routes/                   # API endpoints
│   │   └── utils/                    # Utility functions
│   ├── db/
│   │   ├── migrate.py                # Database migration
│   │   └── seeder.py                 # Sample data
│   ├── tests/                        # Test suite
│   ├── requirements.txt              # Python dependencies
│   ├── pytest.ini                    # Pytest configuration
│   ├── .env.example
│   └── README.md
│
├── TESTING.md                        # Comprehensive testing guide
├── TEST_SUMMARY.md                   # Test summary and statistics
├── QUICK_START_TESTS.md              # Quick test commands
├── run_tests.sh                      # Test runner script
└── README.md                         # This file
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create `.env` file in `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_db

# JWT Configuration
JWT_SECRET=your_secret_key_here
TOKEN_EXPIRE_MINUTES=1440

# API Configuration
API_PORT=8000
DEBUG=True
```

### Frontend Environment Variables

Create `.env.local` file in `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

---

## 🔐 Database Schema

### InventoryItem Table
```sql
CREATE TABLE inventory_item (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    warehouse VARCHAR(100),
    quantity_on_hand INT NOT NULL DEFAULT 0,
    reorder_threshold INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### InventoryTransaction Table
```sql
CREATE TABLE inventory_transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(100) NOT NULL,
    warehouse VARCHAR(100),
    transaction_type ENUM('restock', 'sale', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku) REFERENCES inventory_item(sku)
);
```

### User Table
```sql
CREATE TABLE user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📚 API Documentation

### Authentication

All API endpoints require Bearer token authentication:

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8000/api/inventory/
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Inventory Endpoints

#### List Items
```bash
GET /api/inventory/
Headers: Authorization: Bearer <token>
```

#### Get Single Item
```bash
GET /api/inventory/{item_id}
Headers: Authorization: Bearer <token>
```

#### Create Item
```bash
POST /api/inventory/
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "sku": "SKU001",
  "name": "Product Name",
  "category": "Electronics",
  "warehouse": "Main",
  "quantity_on_hand": 50,
  "reorder_threshold": 10
}
```

#### Update Item
```bash
PUT /api/inventory/{item_id}
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity_on_hand": 75,
  "reorder_threshold": 15
}
```

#### Delete Item
```bash
DELETE /api/inventory/{item_id}
Headers: Authorization: Bearer <token>
```

#### Import CSV
```bash
POST /api/inventory/import
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
file: <csv_file>
```

**CSV Format:**
```csv
sku,name,category,warehouse,quantity_on_hand,reorder_threshold
SKU001,Product 1,Electronics,Main,50,10
SKU002,Product 2,Furniture,Warehouse B,30,5
```

### Transaction Endpoints

#### Import Transactions
```bash
POST /api/transactions/import
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
file: <csv_file>
```

**CSV Format:**
```csv
sku,warehouse,transaction_type,quantity,timestamp
SKU001,Main,restock,50,2026-03-14 10:30:00
SKU002,Warehouse B,sale,10,2026-03-14 11:00:00
```

---

## 🧪 Testing

### Run All Tests
```bash
bash run_tests.sh all
```

### Run Backend Tests Only
```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

### Run Frontend Tests Only
```bash
cd frontend
npm test
```

### Generate Coverage Report
```bash
cd backend
pytest tests/ --cov=app --cov-report=html
open htmlcov/index.html
```

### Test Commands
```bash
# Run specific test file
pytest backend/tests/test_stock_status.py -v

# Run specific test
pytest backend/tests/test_stock_status.py::TestStockStatusLogic::test_in_stock_when_quantity_above_threshold -v

# Run frontend tests in watch mode
npm test:watch

# Generate frontend coverage
npm test:coverage
```

### Test Coverage
- **Stock Status Logic**: 10 tests (100% coverage)
- **Import Validation**: 12 tests (95% coverage)
- **API Endpoints**: 15 tests (90% coverage)
- **Frontend Filters**: 12 tests (90% coverage)
- **Total**: 49 tests (~94% coverage)

---

## 📖 Documentation Files

- **[TESTING.md](TESTING.md)** - Comprehensive testing guide with detailed test descriptions
- **[TEST_SUMMARY.md](TEST_SUMMARY.md)** - Test statistics and overview
- **[QUICK_START_TESTS.md](QUICK_START_TESTS.md)** - Quick reference for common test commands
- **[backend/tests/README.md](backend/tests/README.md)** - Backend test documentation
- **[backend/README.md](backend/README.md)** - Backend-specific setup and configuration

---

## 🔄 Stock Status Logic

The system uses a three-level stock status:

| Status | Condition |
|--------|-----------|
| **IN_STOCK** | Quantity > Reorder Threshold |
| **LOW_STOCK** | Quantity ≤ Reorder Threshold (and > 0) |
| **OUT_OF_STOCK** | Quantity = 0 |

**Example:**
```
Reorder Threshold: 10
- Quantity = 0 → OUT_OF_STOCK
- Quantity = 5 → LOW_STOCK
- Quantity = 10 → LOW_STOCK
- Quantity = 11 → IN_STOCK
- Quantity = 50 → IN_STOCK
```

---

## 📊 CSV Import Features

### Inventory Import
- Bulk create/update inventory items
- Automatic duplicate detection (by SKU)
- Required fields: `sku`, `name`
- Optional fields: `category`, `warehouse`, `quantity_on_hand`, `reorder_threshold`
- **Partial Import**: Accepts valid rows, rejects invalid rows with error details

### Transaction Import
- Record restocks, sales, and adjustments
- Transaction types: `restock`, `sale`, `adjustment`
- Automatic inventory quantity updates
- Timestamp parsing (ISO format or `YYYY-MM-DD HH:MM:SS`)
- Inventory validation (SKU must exist, sufficient stock for sales)

---

## 🔧 Troubleshooting

### Frontend Issues

#### npm install fails with dependency errors
```bash
cd frontend

# Solution 1: Use legacy peer deps flag
npm install --legacy-peer-deps

# Solution 2: Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Port 4002 already in use
```bash
# Find and kill process
lsof -i :4002
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

#### API connection errors
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is enabled in backend

### Backend Issues

#### MySQL connection error
```python
# Check .env file has correct credentials
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<correct_password>
DB_NAME=inventory_db

# Verify MySQL is running
mysql -u root -p -e "SELECT 1;"
```

#### JWT token errors
- Check `JWT_SECRET` is set in `.env`
- Verify token hasn't expired (default: 1440 minutes)
- Use Bearer token format: `Authorization: Bearer <token>`

#### Database migration fails
```bash
# Check database exists
mysql -u root -p -e "USE inventory_db; SHOW TABLES;"

# Re-run migration
python db/migrate.py

# Check seeder
python db/seeder.py
```

### Testing Issues

#### Pytest import errors
```bash
cd backend
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
pytest tests/
```

#### Jest module not found
```bash
cd frontend
# Clear Jest cache
npm test -- --clearCache

# Rebuild
npm install
npm test
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend

# Build
npm run build

# Deploy to Vercel
vercel deploy --prod
```

### Backend Deployment (Heroku/Railway)
```bash
cd backend

# Build
pip freeze > requirements.txt

# Deploy
heroku create inventory-api
git push heroku main
```

### Environment Variables
```bash
# Frontend (Vercel)
- NEXT_PUBLIC_API_URL=https://api.example.com

# Backend (Heroku)
- DB_HOST=your_db_host
- DB_PORT=3306
- DB_USER=your_db_user
- DB_PASSWORD=your_db_password
- DB_NAME=inventory_db
- JWT_SECRET=your_secret
```

---

## 📝 Common Tasks

### Add New Inventory Item
```bash
curl -X POST http://localhost:8000/api/inventory/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "SKU001",
    "name": "Product",
    "category": "Electronics",
    "warehouse": "Main",
    "quantity_on_hand": 50,
    "reorder_threshold": 10
  }'
```

### Export Inventory
1. Log in to dashboard
2. Navigate to Admin → Inventory
3. Use data table export feature
4. Download as CSV

### Create User Account
```bash
# Via login page
1. Click "Sign Up"
2. Enter email and password
3. Submit form

# Or directly in database
INSERT INTO user (email, password_hash, username)
VALUES ('user@example.com', '<bcrypt_hash>', 'username');
```

---

## 🔗 Useful Links

- **API Documentation**: http://localhost:8000/docs
- **Frontend Dashboard**: http://localhost:4002/admin
- **MySQL Workbench**: Download from mysql.com

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 🆘 Support

For issues and questions:
1. Check troubleshooting section above
2. Review documentation files
3. Check API logs: `http://localhost:8000/docs`
4. Open an issue on repository

---

## ✅ Setup Checklist

- [ ] Clone repository
- [ ] Install Node.js v18+
- [ ] Install Python 3.9+
- [ ] Install MySQL 5.7+
- [ ] Setup backend environment
- [ ] Setup frontend environment
- [ ] Create database
- [ ] Run migrations
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Test at http://localhost:4002
- [ ] Run test suite
- [ ] All tests passing ✓

---

## 🎯 Next Steps

1. **Explore Dashboard**: Visit http://localhost:4002
2. **Test API**: Use Postman/Insomnia with token
3. **Import Data**: Try CSV import feature
4. **Run Tests**: Execute `bash run_tests.sh all`
5. **Read Docs**: Check detailed documentation files

---

**Last Updated**: March 14, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
