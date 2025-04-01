@echo off
echo.
echo 🚀 Building Veronica Abstracts for production...
echo.

REM Step 1: Build frontend
echo 🔧 Building frontend...
cd frontend
call npm install
call npm run build
cd ..

REM Step 2: Copy frontend build to backend/public
echo 🧱 Copying frontend build to backend/public...
rmdir /s /q backend\public
xcopy /E /I /Y frontend\dist backend\public

REM Step 3: Build backend
echo 🧰 Preparing backend...
cd backend
call npm install

echo.
echo ✅ Build complete! You can now run the server:
echo.
echo     cd backend
echo     npm start
echo.
pause
