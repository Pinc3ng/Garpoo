@echo off
title Garpoo Cafe Medan - Web App Server
echo ===================================================
echo   GARPOO CAFE MEDAN - QR ORDER & SMART POS SYSTEM
echo ===================================================
echo.
echo Starting local web server at http://localhost:5173 ...
echo.
deno run --allow-net --allow-read server.js
if %ERRORLEVEL% NEQ 0 (
  "%LOCALAPPDATA%\Microsoft\WinGet\Packages\DenoLand.Deno_Microsoft.Winget.Source_8wekyb3d8bbwe\deno.exe" run --allow-net --allow-read server.js
)
pause
