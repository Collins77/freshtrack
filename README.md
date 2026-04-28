# FreshTrack — Food Store Inventory Management System

A full-stack web application for managing food store inventory — built with Node.js, React, and PostgreSQL. Fully Dockerized for plug-and-play deployment.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Demo Credentials](#demo-credentials)
- [Quick Start with Docker](#quick-start-with-docker)
- [Manual Setup](#manual-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Author](#author)

---

## Overview

FreshTrack is a complete inventory management system designed for small food stores managing fruits and vegetables. It provides a clean dashboard for tracking stock, adding new entries, generating reports, and exporting data — all behind a secure JWT-authenticated system.

---

## Tech Stack

### Backend
- **Node.js** + **Express** — REST API server
- **PostgreSQL** — Relational database
- **JWT** + **bcryptjs** — Authentication and password hashing
- **helmet** — HTTP security headers
- **cors** — Cross-origin resource sharing
- **express-validator** — Input validation

### Frontend
- **React** (Vite) — UI framework
- **Redux Toolkit** — State management
- **Tailwind CSS** + **shadcn/ui** — Styling and components
- **React Hook Form** + **Zod** — Form handling and validation
- **Axios** — HTTP client

### Infrastructure
- **Docker** + **Docker Compose** — Containerization
- **Nginx** — Frontend static file serving and routing

---

## Features

- JWT-based authentication (register and login)
- Add, edit, and delete stock entries
- Dashboard with real-time inventory summary
- Reports page with date range filtering and pagination
- CSV export of inventory reports
- Fully responsive — works on mobile and desktop
- Dockerized — one command to run everything
- Pre-loaded with sample data for immediate exploration

---

## Demo Credentials

Once the application is running, use these credentials to log in immediately. No registration required.

| Field | Value |
|-------|-------|
| **URL** | `http://localhost` |
| **Email** | `admin@freshtrack.com` |
| **Password** | `Admin1234` |

The demo account comes pre-loaded with **25 sample stock entries** across Fruits and Vegetables so you can explore the dashboard, reports, filtering, editing, and CSV export right away.

> For production use, register a new account and remove the demo account from the database.

---

## Quick Start with Docker

This is the recommended way to run FreshTrack. Docker handles the database, backend, and frontend automatically.

### Prerequisites

- [Docker Desktop] installed and running
- Ports `80`, `5000`, and `5432` available on your machine

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/collins77/freshtrack.git
cd freshtrack
```

**2. Start all services**
```bash
docker-compose up --build
```

This single command will:
- Pull and start a PostgreSQL database
- Create the database schema automatically
- Load 25 sample stock entries
- Build and start the Node.js backend
- Build and serve the React frontend via Nginx

**3. Open the application**

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/api/health |

**4. Login**

Use the demo credentials above — the dashboard will already have data.

### Stopping the App

```bash
# Stop containers (keeps data)
docker-compose down

# Stop containers and remove all data (fresh start)
docker-compose down -v
```

### Rebuilding After Code Changes

```bash
docker-compose up --build
```

---

## Manual Setup

Follow this if you prefer to run the app without Docker.

### Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm v9 or higher

---

### 1. Clone the Repository

```bash
git clone https://github.com/collins77/freshtrack.git
cd freshtrack
```

---

### 2. Database Setup

Open your PostgreSQL client (psql or pgAdmin) and run:

```sql
CREATE DATABASE freshtrack;
```

Then run the schema and seed:

```bash
psql -U postgres -d freshtrack -f freshtrack-backend/init.sql
psql -U postgres -d freshtrack -f freshtrack-backend/seed.sql
```

---

### 3. Backend Setup

```bash
cd freshtrack-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your local database credentials:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=freshtrack
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

Verify it's working:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "FreshTrack API is running"
}
```

---

### 4. Frontend Setup

Open a new terminal:

```bash
cd freshtrack-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

`.env` should contain:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Documentation

All protected routes require the following header:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT token |
| GET | `/api/auth/me` | Yes | Get current logged-in user |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Login Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Stock Entries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stock` | Yes | Get all entries (paginated) |
| GET | `/api/stock/summary` | Yes | Get dashboard summary stats |
| POST | `/api/stock` | Yes | Create a new stock entry |
| GET | `/api/stock/:id` | Yes | Get a single entry |
| PUT | `/api/stock/:id` | Yes | Update an entry |
| DELETE | `/api/stock/:id` | Yes | Delete an entry |

**Query Parameters for GET `/api/stock`:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20) |
| `category` | string | Filter by `Fruits` or `Vegetables` |
| `from` | date | Filter from date (YYYY-MM-DD) |
| `to` | date | Filter to date (YYYY-MM-DD) |

**Create/Update Entry Request Body:**
```json
{
  "product_name": "Fresh Apples",
  "category": "Fruits",
  "quantity": 150,
  "unit": "kg",
  "unit_price": 2.50,
  "date_added": "2026-04-28"
}
```

**Entry Response:**
```json
{
  "status": "success",
  "data": {
    "entry": {
      "id": "uuid",
      "product_name": "Fresh Apples",
      "category": "Fruits",
      "quantity": "150.00",
      "unit": "kg",
      "unit_price": "2.50",
      "total_value": "375.00",
      "date_added": "2026-04-28"
    }
  }
}
```

**Summary Response:**
```json
{
  "status": "success",
  "data": {
    "total_entries": "25",
    "total_stock_value": "4250.00",
    "total_products": "25",
    "low_stock_alerts": "2",
    "most_stocked_item": "Tomatoes",
    "today_entries": "10"
  }
}
```

---

## Project Structure

```
freshtrack/
├── freshtrack-backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, login, getMe
│   │   │   └── stockController.js    # CRUD + summary
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   └── errorHandler.js       # Global error handler
│   │   ├── routes/
│   │   │   ├── auth.js               # Auth routes
│   │   │   └── stock.js              # Stock routes
│   │   └── validators/
│   │       ├── authValidator.js      # Register/login validation
│   │       └── stockValidator.js     # Stock entry validation
│   ├── init.sql                      # Database schema
│   ├── seed.sql                      # Sample data
│   ├── server.js                     # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── freshtrack-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js              # Redux store
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn components
│   │   │   ├── Layout.jsx            # Page layout wrapper
│   │   │   └── Sidebar.jsx           # Navigation sidebar
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── authSlice.js      # Auth Redux slice
│   │   │   └── stock/
│   │   │       └── stockSlice.js     # Stock Redux slice
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Dashboard.jsx         # Dashboard page
│   │   │   ├── AddStock.jsx          # Add stock form
│   │   │   └── Reports.jsx           # Reports + CRUD
│   │   ├── services/
│   │   │   └── api.js                # Axios instance
│   │   ├── utils/
│   │   │   └── PrivateRoute.jsx      # Auth route guard
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── nginx.conf                    # Nginx config for SPA routing
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

### Backend — `freshtrack-backend/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `freshtrack` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `yourpassword` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |

### Frontend — `freshtrack-frontend/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## Common Issues

**Port already in use:**
```bash
# Check what's using port 80 or 5000
netstat -ano | findstr :80
# Then stop Docker containers
docker-compose down
```

**Database not initializing:**
```bash
# Remove volume and restart fresh
docker-compose down -v
docker-compose up --build
```

**Frontend can't reach backend:**
- Ensure `VITE_API_URL` in `.env` matches your backend URL
- For Docker, the frontend talks to `http://localhost:5000/api`

**Changes not reflecting after rebuild:**
```bash
docker-compose down
docker-compose up --build --force-recreate
```

---

## Author

**Collins Muema**
Backend Software Engineer
    collinsmuemah@gmail.com
    [github.com/collins77](https://github.com/collins77)

---

*Built as a practical assignment for ABC Lab Net — demonstrating full-stack Node.js development, system design, and client-ready delivery.*