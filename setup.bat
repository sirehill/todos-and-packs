@echo off
echo 🚀 Setting up Packs & Lists WIP (Preview -> Confirm -> Commit)
call npm install
call npm run prisma:gen
call npm run prisma:migrate
call npm run db:seed
call npm run dev
