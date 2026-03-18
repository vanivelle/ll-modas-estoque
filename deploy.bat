@echo off
echo ===================================
echo DEPLOY ESTOQUE-UNIVERSAL VERCEL
echo ===================================
echo.

cd /d "c:\Users\guigu\OneDrive\Documentos\web\ll-modas\estoque-universal"

echo [1/4] Git Status...
git status
echo.

echo [2/4] Git Add...
git add -A

echo [3/4] Git Commit (se houver mudanças)...
git commit -m "deploy: Auto-deploy from script" || echo "Nada para commitar"

echo [4/4] Git Push...
git push origin main

echo.
echo [VERCEL] Iniciando deploy em produção...
echo.

vercel --prod --force --yes

echo.
echo ===================================
echo DEPLOY CONCLUÍDO!
echo URL: https://estoque-universal.vercel.app
echo ===================================
pause
