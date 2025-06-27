# Step 1：建立虛擬環境

- python3 -m venv venv

# Step 2：啟動虛擬環境

- .\venv\Scripts\Activate.ps1 (Windows PowerShell) || source venv/bin/activate (macOS / Linux)

# Step 3：安裝依賴

- pip install -r requirements.txt

# Step 4：啟動 FastAPI

- npm run start || uvicorn app.main:app --reload

# Step 5：確保 venv 不會被 git 追蹤 (.gitignore)

- venv/

# 停用虛擬環境

- deactivate
