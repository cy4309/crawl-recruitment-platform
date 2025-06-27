# Step 1：建立虛擬環境

- python3 -m venv venv

# Step 2：啟動虛擬環境

- .\venv\Scripts\Activate.ps1 (Windows PowerShell) || source venv/bin/activate (macOS / Linux)

# Step 3：安裝依賴

- pip install -r requirements.txt

# Step 4：啟動 FastAPI

- uvicorn app.main:app --reload (--reload 可用在本地開發，後端不用重啟) ||
  uvicorn app.main:app --host=0.0.0.0 --port=8000 (上線用，Render 是外部機器，需明確指定--host=0.0.0.0) ||
  npm run start (部屬會需多載 node)

# Step 5：確保 venv 不會被 git 追蹤 (.gitignore)

- venv/

# 停用虛擬環境

- deactivate
