# Backend Setup Guide

## Prerequisites

Make sure you have:
- Python 3.8 or higher
- pip3 (Python package manager)

## Installation

### 1. Navigate to the backend folder
```bash
cd backend
```

### 2. Install dependencies using pip3
```bash
pip3 install -r requirements.txt
```

## Running the Application

### Start the development server
```bash
python3 -m uvicorn app.main:app --reload
```

The server will run at `http://127.0.0.1:8000`

## Database Setup

### 1. Run Migrations
Create database tables:
```bash
python3 db/migrate.py
```

### 2. Run Seeders
Populate database with sample data:
```bash
python3 db/seeder.py
```
