@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo  🖼️ 自動更新 images.json...
echo ========================================
powershell -ExecutionPolicy Bypass -File ".\generate-image-list.ps1"
echo.

echo 🔍 檢查是否有變動...
git add .

git diff --cached --quiet
if %errorlevel%==0 (
    echo ⚠️ 沒有任何變動，不需要部署。
    pause
    exit /b
)

echo 📦 偵測到變動，正在部署...
echo.
echo 變動的檔案：
git diff --cached --name-only
echo.

git commit -m "網站更新 %date% %time:~0,5%"
git push

if %errorlevel%==0 (
    echo.
    echo ✅ 部署完成！Vercel 正在自動更新中...
    echo 🌐 約 30 秒～1 分鐘後即可看到更新。
) else (
    echo.
    echo ❌ 推送失敗，請檢查網路連線或 Git 設定。
)

pause