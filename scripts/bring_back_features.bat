@echo off
REM Packs & Lists — bring back features / migrate schema (Windows)
setlocal
echo Installing dependencies...
npm install || goto :error

echo Formatting Prisma schema...
npx prisma format || goto :error

echo Creating / applying migration...
npx prisma migrate dev -n bring_back_features || goto :error

echo Done.
goto :eof
:error
echo.
echo *** ERROR: one of the steps failed. Check the output above. ***
exit /b 1
