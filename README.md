# Kopi Karsa

Sistem Manajemen dan Kasir (Point of Sale / POS) untuk kedai kopi, dibangun menggunakan **Next.js**, **Prisma ORM**, dan **MariaDB / MySQL**.

---

## Panduan Clone dan Menjalankan Project

Project ini dapat dijalankan dengan 2 cara:
1. **Setup Lokal (Standar)**: Menjalankan MySQL secara lokal (XAMPP, Laragon, atau MySQL bawaan Windows) dan menjalankan Next.js di laptop Anda.
2. **Setup Docker**: Menjalankan seluruh aplikasi beserta database (atau hanya databasenya saja) di dalam container Docker.

---

### Opsi 1: Setup Lokal (Direkomendasikan untuk Pengembangan)

#### 1. Clone repository
```bash
git clone https://github.com/btngs/kopi-karsa.git
cd kopi-karsa
```

#### 2. Install dependency
```bash
npm install
```

#### 3. Konfigurasi file environment
Salin file template environment:
```bash
# Untuk Linux / macOS
cp .env.example .env

# Untuk Windows PowerShell
Copy-Item .env.example .env
```
Buka file `.env` dan sesuaikan kredensial MySQL lokal Anda:
```env
DATABASE_URL="mysql://root:password_anda@localhost:3306/kopi_karsa"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="password_anda"
DB_NAME="kopi_karsa"
```

#### 4. Siapkan database
Pastikan service MySQL / MariaDB lokal Anda sudah aktif, lalu buat databasenya jika belum tersedia:
```sql
CREATE DATABASE IF NOT EXISTS kopi_karsa;
```

Jalankan push skema Prisma untuk membuat semua tabel:
```bash
npx prisma db push
```

#### 5. Jalankan server pengembangan
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

### Opsi 2: Setup Menggunakan Docker

Gunakan opsi ini jika Anda tidak ingin menginstal atau mengaktifkan MySQL manual di laptop Anda.

#### A. Full Stack dengan Docker (Aplikasi + Database)
Pastikan Docker Desktop sudah dibuka dan aktif, lalu jalankan:
```bash
# 1. Salin template environment
Copy-Item .env.example .env

# 2. Build dan jalankan seluruh container
docker compose up --build -d

# 3. Sinkronkan skema tabel database
docker compose exec app npx prisma db push
```
Aplikasi langsung dapat diakses di [http://localhost:3000](http://localhost:3000).

#### B. Hanya Database di Docker (Next.js Dijalankan Lokal)
Jika hanya ingin databasenya yang berjalan di Docker sementara Next.js dijalankan lewat `npm run dev`:
```bash
# Jalankan container MariaDB pada port 3307
docker compose up db -d

# Sinkronkan skema Prisma
npx prisma db push

# Jalankan Next.js
npm run dev
```

---

## Mengakses dan Mengelola Database

Anda dapat melihat serta mengedit isi database secara visual melalui **Prisma Studio**:
```bash
npx prisma studio
```
Lalu buka browser di [http://localhost:5555](http://localhost:5555).

Atau hubungkan melalui aplikasi database GUI favorit Anda (DBeaver, TablePlus, HeidiSQL, phpMyAdmin, dll.):
- **Host**: `localhost`
- **Port**: `3306` (MySQL lokal) atau `3307` (Port container Docker)
- **User**: `root`
- **Database**: `kopi_karsa`

---

## Teknologi yang Digunakan
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: MariaDB / MySQL
- **Kontainerisasi**: Docker & Docker Compose
