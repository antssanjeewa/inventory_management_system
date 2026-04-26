# Ceyntics ERP — Inventory Management System

A secure, internal Inventory Management System designed for Ceyntics Systems (Pvt) Ltd to track tools, products, and electronic components across physical storage locations.

## 🚀 Overview

This project is a full-stack web application consisting of a **Laravel 12 API** backend and a **Next.js 15** frontend. It features robust stock management, concurrency protection, audit logging, and role-based access control.

### Key Features
- **Secure Authentication**: Laravel Sanctum with role-based access (Admin/Staff).
- **Inventory Tracking**: Manage items with unique codes, serial numbers, and automatic status updates.
- **Hierarchical Storage**: Logic-based organization (Cupboards → Places → Items).
- **Borrowing System**: Atomic transactions for borrowing and returning items with stock validation.
- **Audit Logging**: Comprehensive activity logs for all significant system actions.
- **Modern UI**: Dark-themed, responsive design built with Tailwind CSS.

## 🏗️ Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+), PostgreSQL, Laravel Sanctum.
- **Frontend**: Next.js 15 (React 19), Axios, Tailwind CSS.
- **Design**: Google Fonts (Inter, Material Symbols).

## 📂 Project Structure

```bash
/
├── backend/          # Laravel 13 API
└── frontend/         # Next.js 16 Frontend
```

## 🛠️ Setup Instructions

### 1. Backend Setup (Laravel)
Navigate to the `backend` directory and follow the instructions in the [Backend README](./backend/README.md).

```bash
cd backend
composer install
php artisan migrate --seed
php artisan serve
```

### 2. Frontend Setup (Next.js)
Navigate to the `frontend` directory and follow the instructions in the [Frontend README](./frontend/README.md).

```bash
cd frontend
npm install
npm run dev
```

---
Developed by **Ants Sanjeewa** · © 2026 Ceyntics Systems (Pvt) Ltd.
