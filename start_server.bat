@echo off
setlocal

set "destination_folder=C:\Program Files\SIMAPE"

REM 2. Navegar a la carpeta del repositorio clonado
cd /d "%destination_folder%"

REM npm install -g pm2

REM 4. Ejecutar el servidor utilizando pm2
npm run start

endlocal