@echo off
chcp 65001 >nul
title Claude Code CLI - Working Directory Setup
cls
echo =====================================
echo    Claude Code CLI Setup
echo =====================================
echo.

:: Set current folder as working directory
set WORK_FOLDER=%cd%
echo Working Directory: %WORK_FOLDER%
echo.

:: Find GitHub token
set TOKEN_FOUND=NO
for %%D in (D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if exist "%%D:\code\ark\tokens\github.txt" (
        set /p GITHUB_TOKEN=<"%%D:\code\ark\tokens\github.txt"
        set TOKEN_FOUND=YES
        echo [OK] GitHub token loaded
        goto :token_done
    )
)
:token_done

if "%TOKEN_FOUND%"=="NO" (
    set GITHUB_TOKEN=YOUR_TOKEN_HERE
    echo [WARNING] GitHub token not found
)
echo.

:: Update MCP config for current directory
set CONFIG_PATH=%APPDATA%\Claude\claude_desktop_config.json
echo [CONFIG] Updating MCP settings...

(
echo {
echo   "mcpServers": {
echo     "filesystem": {
echo       "command": "npx",
echo       "args": ["-y", "@modelcontextprotocol/server-filesystem"],
echo       "env": {
echo         "ALLOWED_DIRECTORIES": "%WORK_FOLDER:\=\\%"
echo       }
echo     },
echo     "github": {
echo       "command": "npx",
echo       "args": ["-y", "@modelcontextprotocol/server-github"],
echo       "env": {
echo         "GITHUB_PERSONAL_ACCESS_TOKEN": "%GITHUB_TOKEN%"
echo       }
echo     },
echo     "memory": {
echo       "command": "npx",
echo       "args": ["-y", "@modelcontextprotocol/server-memory"]
echo     }
echo   }
echo }
) > "%CONFIG_PATH%"

echo [OK] MCP configured for: %WORK_FOLDER%
echo.

:: Check if claude is available
where claude >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo =====================================
    echo    Claude Code not found in PATH
    echo =====================================
    echo.
    echo Please ensure Claude Code is installed:
    echo   npm install -g @anthropic/claude-cli
    echo.
    echo Or if installed locally, add to PATH:
    echo   set PATH=%%PATH%%;[claude-installation-path]
    echo.
    pause
    exit /b
)

:: Mode selection menu
:menu
echo =====================================
echo    Select Claude Code Mode
echo =====================================
echo.
echo   1. Normal Mode (with permissions)
echo   2. Beast Mode (skip all permissions)
echo   3. Exit
echo.
set /p MODE=Select mode (1-3):

if "%MODE%"=="1" goto normal_mode
if "%MODE%"=="2" goto beast_mode
if "%MODE%"=="3" goto exit_script

echo Invalid selection. Please try again.
echo.
goto menu

:normal_mode
echo.
echo =====================================
echo    Starting Claude Code (Normal Mode)
echo =====================================
echo.
claude
goto end

:beast_mode
echo.
echo =====================================
echo    Starting Claude Code (Beast Mode)
echo =====================================
echo Warning: All permissions will be bypassed!
echo.
claude --dangerously-skip-permissions
goto end

:exit_script
echo.
echo Exiting...
exit /b

:end