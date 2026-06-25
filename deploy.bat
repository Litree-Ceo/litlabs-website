@echo off
cd /d C:\home\litbit\LiTTreeLabstudios\home\litbit\LiTTreeLabstudios
git add -A
git commit -m "fix: navbar, settings, builder theme, webhook" 2>nul
call npx vercel --prod --yes
pause
