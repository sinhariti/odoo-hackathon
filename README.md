# Core Inventory Management System
A full-stack, real-time inventory and warehouse management system built for speed and reliability.

## 🚀 Tech Stack
*   **Frontend**: React, Tailwind CSS, Vite
*   **Backend**: Node.js, Express
*   **Database**: PostgreSQL
*   **ORM**: Sequelize
*   **Infrastructure**: Docker (for Database)

## 📦 Features
*   **Multi-Warehouse Support**: Manage multiple warehouses and granular shelf locations.
*   **Stock Moves**: Track receipts (inbound), deliveries (outbound), and internal transfers.
*   **Inventory Adjustments**: Perform manual stock counts with historical audit trails.
*   **Interactive Dashboard**: Real-time Key Performance Indicators (KPIs) and low-stock alerts.
*   **Automated Reordering Rules**: Set minimum stock thresholds to automatically generate purchase receipts.

## ⚡ Quick Start (Windows)
We have included an automated startup script that spins up the Database, Backend API, and Frontend UI in one click.

### Requirements:
*   [Node.js](https://nodejs.org/) installed
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Run the Startup Script
Simply double-click the `start.bat` file in the root directory (or run it via terminal).

```cmd
.\start.bat
```

### What does `start.bat` do?
1. Boots up a **PostgreSQL 16** database container via Docker.
2. Automatically copies `server/.env.example` to `server/.env` if it's missing.
3. Automatically creates the database schema and **seeds initial test data** (Products, Warehouses, Locations, Stock, etc.).
4. Opens a new terminal to run the **Node.js API** on `http://localhost:3000`.
5. Opens a new terminal to run the **React Frontend** on `http://localhost:5173`.

---

## 🏗️ Manual Setup (Mac/Linux)

### 1. Start the Database
```bash
docker-compose up -d
```

### 2. Start the Backend API
```bash
cd server
cp .env.example .env
npm install
node seed_data/seed.js  # Build schema and inject dummy data
npm run dev
```

### 3. Start the Frontend UI
```bash
cd client
npm install
npm run dev
```

---

## 🔐 Default Logins
*(After running the seed script)*

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@example.com | admin123 |
| **Manager** | manager@example.com | manager123 |
| **Worker** | worker@example.com | worker123 |
