@echo off
color 0A
title  QUIZ APP LAUNCHER
mode con: cols=60 lines=30

cls
echo.
echo   ######   ##   ##  ######  #######
echo  ##    ##  ##   ##    ##       ##
echo  ##    ##  ##   ##    ##       ##
echo  ##    ##  ##   ##    ##       ##
echo   ######    #####   ######     ##
echo.
echo   ####   #####   #####
echo  ##  ##  ##  ##  ##  ##
echo  ######  #####   #####
echo  ##  ##  ##      ##
echo  ##  ##  ##      ##
echo.
echo  ============================================
echo       SYSTEM BOOT SEQUENCE INITIATED...
echo  ============================================
echo.
ping -n 2 127.0.0.1 >nul

set "bar=                          "
set "msg=Initializing..."
call :draw_bar
ping -n 2 127.0.0.1 >nul

set "bar=#                         "
set "msg=Checking port..."
call :draw_bar
ping -n 2 127.0.0.1 >nul

set "bar=###                       "
set "msg=Killing old process..."
call :draw_bar
:: Kill process on port 3000
netstat -ano | findstr ":3000" | findstr "LISTENING" > "%TEMP%\port3000.txt" 2>nul
for /f "tokens=5" %%a in (%TEMP%\port3000.txt) do taskkill /PID %%a /F >nul 2>&1
del "%TEMP%\port3000.txt" >nul 2>&1
ping -n 2 127.0.0.1 >nul

set "bar=#######                   "
set "msg=Port cleared!"
call :draw_bar
ping -n 2 127.0.0.1 >nul

set "bar=##########                "
set "msg=Loading server..."
call :draw_bar
start /B node "%~dp0js\server.js"
ping -n 2 127.0.0.1 >nul

set "bar=#############             "
set "msg=Server booting..."
call :draw_bar
ping -n 2 127.0.0.1 >nul

set "bar=################          "
set "msg=Connecting..."
call :draw_bar
ping -n 2 127.0.0.1 >nul

set "bar=###################       "
set "msg=Almost there..."
call :draw_bar
ping -n 2 127.0.0.1 >nul

set "bar=######################    "
set "msg=Opening browser..."
call :draw_bar
start http://localhost:3000/html/index.html
ping -n 2 127.0.0.1 >nul

set "bar=##########################"
set "msg=READY!!! LETS GO!!!"
call :draw_bar
echo.
echo  ============================================
echo    ^>^>  http://localhost:3000  ^<^<
echo  ============================================
echo.
echo    [ Press any key to STOP the server ]
pause >nul
goto :eof

:draw_bar
cls
echo.
echo   ######   ##   ##  ######  #######
echo  ##    ##  ##   ##    ##       ##
echo  ##    ##  ##   ##    ##       ##
echo  ##    ##  ##   ##    ##       ##
echo   ######    #####   ######     ##
echo.
echo   ####   #####   #####
echo  ##  ##  ##  ##  ##  ##
echo  ######  #####   #####
echo  ##  ##  ##      ##
echo  ##  ##  ##      ##
echo.
echo  ============================================
echo.
echo    [%bar%]
echo.
echo    %msg%
echo.
echo  ============================================
goto :eof