@echo off
cd /d "%~dp0"
echo HeroFactory server starting on http://0.0.0.0:8080
echo Open http://192.168.32.149:8080 on your MacBook Air while this window stays open.
node tools\static-server.js
