@echo off
setlocal
set PGPASSWORD=srilakshmi24

echo 📦 Creating tables...
cmd /C ""C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -d supplydb -f schema.sql"

echo 📥 Inserting sample data...
cmd /C ""C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -d supplydb -f data.sql"

echo ✅ Done.
pause
