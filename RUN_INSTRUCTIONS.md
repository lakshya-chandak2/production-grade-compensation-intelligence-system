# Compensation Intelligence System - Separated Structure

The project has been separated into Frontend and Backend folders as requested.

## 🚀 How to Run

### 1. Run the Backend
Open a terminal, navigate to the `backend` folder, and run:
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
The backend will run on **http://localhost:5000**.

### 2. Run the Frontend
Open a **new** terminal, navigate to the `frontend` folder, and run:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on **http://localhost:3000** (or 3001 if 3000 is occupied).

## 📁 Structure
- `frontend/`: Next.js application (UI Components, Pages, Styling).
- `backend/`: Node.js Express server (API Routes, Database/Prisma logic).

---
*Note: No theme or design changes were made to the UI.*
