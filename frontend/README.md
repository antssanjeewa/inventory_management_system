# Ceyntics ERP — Frontend (Next.js App)

This is the frontend application for the Ceyntics Inventory Management System, built with Next.js 15.

## 🛠️ Requirements

- Node.js 20+
- NPM / Yarn

## 🚀 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   The application expects the backend API to be running at `http://127.0.0.1:8000/api`. This can be configured in the API client library (`lib/api.ts`).

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

- **App Router**: Uses Next.js 15 App Router with Route Grouping (`(home)` vs `(root)`).
- **Service Layer**: Decoupled API logic in `services/` directory.
- **Middleware**: Server-side route protection and role-based redirects.
- **Design System**: Atomic CSS with Tailwind CSS v4 and a Material-inspired dark theme.

## 🧭 Navigation

- `/` - Login Page
- `/dashboard` - Overview & Statistics
- `/inventory` - Manage and Search Items
- `/borrowing` - Record borrows and returns
- `/storage` - Manage physical cupboards and places
- `/users` - User Management (Admin Only)
- `/activity-logs` - System Audit Trail (Admin Only)

---
Developed by **Ants Sanjeewa** · © 2026 Ceyntics Systems (Pvt) Ltd.
