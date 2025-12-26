# 🛠️ Installation

1️. Clone the Repository
```bash
git clone https://github.com/anhleh33/SPNC_gnnclassifier.git
cd SPNC_gnnclassifier
```

2. Install Dependencies
```bash
npm install
```

3. Running the Project
```bash
npm run dev
```

Open the browser at:
```bash
http://localhost:3000
```
   
Or you can find the browser link in terminal where you execute the commands.

# Backend
1. Create Virtual Environment
```bash
cd backend
python -m venv .venv
```

2. Packages and library installations
```bash
pip install -r Requirements.txt
```

3. Setup .env
`.env` file should be put in `backend` folder
content in `.env` file will be:
```env
DATABASE_URL=postgresql+psycopg://postgres.kmgxlpoiuohradgrwwlm:[Your-Password]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
```
🔐 Replace [Password] with your actual database password.

4. Run backend
Run the backend from the project root:
```bash
source backend/.venv/Scripts/Activate
python -m backend.app
```
The backend will be available at:
```bash
http://localhost:5000
```