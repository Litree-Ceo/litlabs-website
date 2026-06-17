@echo off
cd /d C:\home\litbit\LiTTreeLabstudios\home\litbit\LiTTreeLabstudios
call npx vercel link --scope larrys-projects-db0e2aa2 --project frontend --yes 2>nul
call npx vercel --scope larrys-projects-db0e2aa2 --project frontend --prod --yes
pause
