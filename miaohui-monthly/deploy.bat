@echo off
cd /d "%~dp0"
git add .
git commit -m "更新圖片 %date% %time:~0,5%"
git push
echo ✅ 部署完成！Vercel 正在自動更新中...
pause