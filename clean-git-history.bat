@echo off
echo Cleaning Git history to remove secrets...
echo.

REM Step 1: Remove the Firebase service account file from all commits
echo Step 1: Removing Firebase service account JSON from history...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch 'codeguidex-5e48d-firebase-adminsdk-fbsvc-09ca66027c[1].json' 'codeguidex-5e48d-firebase-adminsdk-fbsvc-09ca66027c.json' '*.json' 2>nul" --prune-empty --tag-name-filter cat -- --all

REM Step 2: Clean up refs
echo Step 2: Cleaning up refs...
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo.
echo History cleaned! Now you can force push:
echo git push origin main --force
echo.
pause
