@echo off
title Smart Surat City Portal - Local Server

echo.
echo 🌊 Starting Smart Surat City Portal...
echo.

:: Start the server from backend/server.js
echo 🚀 Starting server...
start "" "http://localhost:3000"
node backend/server.js

:: Keep window open
pause