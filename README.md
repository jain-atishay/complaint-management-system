# 📬 Complaint Management System

A full-stack web app where users can submit complaints and admins can manage them — built using React, Tailwind, Express, and PostgreSQL.

---

## 🚀 Features

- 📝 Users can submit complaints
- ✅ Form validation with real-time feedback
- 📬 Admin dashboard to:
  - View all complaints
  - Filter by status (All / Pending / Resolved)
  - Toggle status (Pending ↔ Resolved)
  - Delete complaints ✅ *(Bonus feature!)*
- 🌈 Clean and responsive UI with Tailwind CSS

---

## 🛠 Tech Stack

| Frontend         | Backend         | Database    |
|------------------|------------------|-------------|
| React + TS + Vite| Node.js + Express| PostgreSQL  |
| Tailwind CSS     | Axios (HTTP)     | pg module   |

---

## 🧪 How to Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/complaint-app.git
cd complaint-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env`:

```
DATABASE_URL=postgresql://complaints_user:password@localhost:5432/complaints_db
```

Create table:

```sql
CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  complaint TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

Run backend:

```bash
node index.js
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## ✅ Bonus Features Implemented

- ✅  Delete complaints  
- ✅  Filter tabs (All / Pending / Resolved)  
- ✅  Responsive design with Tailwind  
- ✅  Field validation with error messages  
- ✅  Success message after submission

---

## 📷 Screenshot


![App Screenshot](./screenshots/complaint-ui.png)


---

## 📈 Improvements With More Time

- Admin login
- Sorting, pagination
- Email notifications
- CSV export
- Deployment on Netlify/Render

---

## 🤝 Author

- Name: Atishay Jain
- UCSD MSCS Student, Class of 2025