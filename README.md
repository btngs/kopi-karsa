# Kopi Karsa ☕

Point of Sale (POS) and Management System for Coffee Shops, built with **Next.js**, **Prisma ORM**, and **MariaDB / MySQL**.

---

## 🚀 How to Clone and Run

You can run this project in two ways:
1. **Local Setup (Standard)**: Run MySQL locally (e.g. XAMPP, Laragon, or native MySQL) and Next.js on your machine.
2. **Docker Setup (Zero-config)**: Run everything (or just the database) inside Docker containers.

---

### Option 1: Local Setup (Recommended for Development)

#### 1. Clone the repository
```bash
git clone https://github.com/btngs/kopi-karsa.git
cd kopi-karsa
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Setup environment variables
Copy the example environment file:
```bash
# On Linux/macOS
cp .env.example .env

# On Windows PowerShell
Copy-Item .env.example .env
```
Open `.env` and adjust your MySQL credentials:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/kopi_karsa"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="your_password"
DB_NAME="kopi_karsa"
```

#### 4. Prepare the database
Make sure your local MySQL/MariaDB service is running, then create the database if it doesn't exist yet:
```sql
CREATE DATABASE IF NOT EXISTS kopi_karsa;
```

Push the Prisma schema to create all tables:
```bash
npx prisma db push
```

#### 5. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser!

---

### Option 2: Docker Setup

If you don't want to install or run MySQL directly on your laptop, Docker makes it super easy.

#### A. Full Stack with Docker (App + Database)
Just make sure Docker Desktop is open and run:
```bash
# 1. Create .env file
Copy-Item .env.example .env

# 2. Build and spin up the containers
docker compose up --build -d

# 3. Push database schema
docker compose exec app npx prisma db push
```
Open [http://localhost:3000](http://localhost:3000) and you're good to go!

#### B. Only Database in Docker (Next.js run locally)
If you just want the database in Docker and prefer running `npm run dev` locally:
```bash
# Start MariaDB container on port 3307
docker compose up db -d

# Sync Prisma schema
npx prisma db push

# Start Next.js
npm run dev
```

---

## 🗄️ Database Inspection

You can inspect and manage your data easily using **Prisma Studio**:
```bash
npx prisma studio
```
Then visit [http://localhost:5555](http://localhost:5555).

Alternatively, connect via your favorite database GUI (DBeaver, TablePlus, HeidiSQL, etc.):
- **Host**: `localhost`
- **Port**: `3306` (Local MySQL) or `3307` (Docker mapped port)
- **User**: `root`
- **Database**: `kopi_karsa`

---

## 🛠️ Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: MariaDB / MySQL
- **Containerization**: Docker & Docker Compose
