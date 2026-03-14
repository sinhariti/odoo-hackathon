@echo off
echo ====================================================
echo   Starting Odoo Hackathon Services with Docker
echo ====================================================

echo.
echo [1/4] Starting Database (Docker Compose)...
REM Start docker-compose in detached mode
docker-compose up -d

echo Waiting for database to be ready (10 seconds)...
timeout /t 10 /nobreak > NUL

echo.
echo [2/4] Checking Backend Environment...
if not exist "server\.env" (
    echo [INFO] server\.env not found. Copying from .env.example...
    if exist "server\.env.example" (
        copy "server\.env.example" "server\.env"
        echo [OK] Copied .env.example to .env
    ) else (
        echo [WARNING] server\.env.example not found! Server might fail to start.
    )
) else (
    echo [OK] server\.env already exists.
)

echo.
echo [3/4] Seeding Database Data...
echo Running sequence drop and seed...
cd server
REM Running the seed script which handles drops, syncs, and seeds
node seed_data/seed.js
cd ..

echo.
echo [4/4] Starting Services...
start "Backend Server" cmd /k "cd server && npm run dev"
start "Frontend Client" cmd /k "cd client && npm run dev"

echo.
echo ✅ Database, Backend, and Frontend are all running!
echo Note: The database is running in a Docker container in the background.
echo.
pause
