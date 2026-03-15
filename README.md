# Tim Teknologi Global

Inventory Management System built with Next.js and FastAPI. Supports stock tracking, transaction management, CSV bulk import, and dashboard analytics.

---

## Requirements

- **Frontend**: Node.js 18+, Next.js 15, React 19, TypeScript
- **Backend**: Python 3.9+, FastAPI, SQLAlchemy
- **Database**: MySQL 8.0

---

## Run with Docker

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set:
- `DB_PASSWORD` - MySQL root password
- `DB_NAME` - database name
- `SECRET_KEY` - JWT secret key
- `NEXT_PUBLIC_API_URL` - backend URL from browser (e.g. `http://localhost:8000`)

Make sure ports 3306, 8000, and 4002 are free before running.

### 2. Build and run

```bash
docker compose -f docker-compose.yml up --build -d
```

### 3. Migrate and seed (first time only)

```bash
docker compose -f docker-compose.yml exec backend python db/migrate.py
docker compose -f docker-compose.yml exec backend python db/seeder.py
```

---

## Run Manually (Without Docker)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=db_inventory
SECRET_KEY=your_secret_key
TOKEN_EXPIRE_MINUTES=1440
```

```bash
python db/migrate.py
python db/seeder.py
python3 -m uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

---

## Run Tests

```bash
# Run all tests
./run_tests.sh all

# Run backend tests only
./run_tests.sh backend

# Run frontend tests only
./run_tests.sh frontend
```

You can also run tests manually:

```bash
cd backend
pytest tests/ -v

cd ../frontend
npm test
```

---

## URLs

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:4002      |
| Backend  | http://localhost:8000      |
| Swagger  | http://localhost:8000/docs |

---

## Login Credentials

| Field    | Value          |
|----------|----------------|
| Email    | admin@mail.com |
| Password | Admin123       |
