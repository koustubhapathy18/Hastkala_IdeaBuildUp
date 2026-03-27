# 🚀 Hastkala — How to Run the Website (Complete Guide)

## Quick Overview

Your website has **two servers** that MUST run together:

| Server | What it does | Port | Folder |
|--------|-------------|------|--------|
| **Backend** (Node.js + Express) | Handles products, users, orders, login | `localhost:5001` | `backend/` |
| **Frontend** (React + Vite) | The website UI you see in browser | `localhost:5173` | Root `/` |

> ⚠️ **ALWAYS start the Backend FIRST, then the Frontend.**

---

## Step-by-Step: Starting the Website

### Step 1 — Open a Terminal and Start the Backend

```bash
cd /home/kp/hi/hastkala_all/Alchemist-Techspire-1.0-/backend
npm install
node server.js
```

You should see:
```
Server is running on port 5001
MongoDB connected
```

> ✅ If you see "MongoDB connected" — you're good! The database is cloud-hosted (MongoDB Atlas), so you just need internet.

### Step 2 — Open a SECOND Terminal and Start the Frontend

```bash
cd /home/kp/hi/hastkala_all/Alchemist-Techspire-1.0-
npm install
npm run dev
```

You should see:
```
VITE ready in Xms
➜ Local: http://localhost:5173/
```

### Step 3 — Open the Website

Go to **http://localhost:5173/** in your browser. Everything should work!

---

## 🛑 How to Stop the Servers

- Press `Ctrl + C` in each terminal to stop each server.

---

## 🔄 Reseed the Database (Reset All Data)

If products or users are missing from the database, run the seed script:

```bash
cd /home/kp/hi/hastkala_all/Alchemist-Techspire-1.0-/backend
node seed.js
```

This will:
- Clear all existing products, users, and orders
- Insert all sample products
- Create demo user accounts
- Create sample orders

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Buyer** | `buyer@hastkala.com` | `buyer123` |
| **Artisan** | `artisan@hastkala.com` | `artisan123` |
| **Admin** | `admin@hastkala.com` | `admin123` |

### Where to login:
- **Buyer / Artisan** → Click the user icon (top-right) → Login page
- **Admin** → Go to `http://localhost:5173/admin/login`

---

## 📁 Project Structure

```
Alchemist-Techspire-1.0-/
├── backend/                  ← Backend Server
│   ├── server.js             ← Main server file (starts on port 5001)
│   ├── .env                  ← Database URL + secrets (DO NOT share!)
│   ├── seed.js               ← Database seeder script
│   ├── models/               ← Database schemas
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/               ← API endpoints
│   │   ├── auth.js           ← Login/Signup (/api/auth/*)
│   │   ├── products.js       ← Products CRUD (/api/products/*)
│   │   ├── artisans.js       ← Artisan profiles (/api/artisans/*)
│   │   ├── orders.js         ← Orders (/api/orders/*)
│   │   └── admin.js          ← Admin panel (/api/admin/*)
│   └── package.json
│
├── src/                      ← Frontend (React)
│   ├── components/           ← Reusable UI components
│   ├── pages/                ← All pages (Home, Cart, Checkout, etc.)
│   ├── contexts/             ← Cart & Wishlist state management
│   └── data/                 ← Local fallback product/artisan data
│
├── public/images/            ← Product & artisan images
├── vite.config.js            ← Vite config (proxies /api → port 5001)
└── package.json
```

---

## 🔌 How Frontend Talks to Backend

The file `vite.config.js` has a proxy setting:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true
    }
  }
}
```

This means: any request the frontend makes to `/api/...` gets forwarded to the backend on port 5001. That's why the backend MUST be running.

---

## ❗ Common Problems & Fixes

### "Products not showing / Product Not Found"
**Cause:** Backend server is not running.
**Fix:** Start the backend first (`cd backend && node server.js`).

### "MongoDB connection error"
**Cause:** No internet connection (database is cloud-hosted).
**Fix:** Check your internet connection.

### "Port 5001 is already in use"
**Cause:** Backend is already running in another terminal.
**Fix:** Find and kill it:
```bash
lsof -i :5001
kill -9 <PID>
```

### "Port 5173 is already in use"
**Cause:** Frontend is already running somewhere else.
**Fix:** Vite will auto-pick the next port (5174, 5175...), or kill the old one:
```bash
lsof -i :5173
kill -9 <PID>
```

---

## 📋 All Commands Cheat Sheet

| Action | Command | Run From |
|--------|---------|----------|
| Install backend packages | `npm install` | `backend/` folder |
| Start backend server | `node server.js` | `backend/` folder |
| Start backend (auto-reload) | `npm run dev` | `backend/` folder |
| Seed/reset database | `node seed.js` | `backend/` folder |
| Install frontend packages | `npm install` | Root folder |
| Start frontend dev server | `npm run dev` | Root folder |
| Build for production | `npm run build` | Root folder |
| Preview production build | `npm run preview` | Root folder |
