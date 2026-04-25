# Ceyntics ERP — Backend (Laravel API)

This is the RESTful API for the Ceyntics Inventory Management System, built with Laravel 12.

## 🛠️ Requirements

- PHP 8.2+
- Composer
- PostgreSQL
- Node.js & NPM (for Vite assets)

## 🚀 Installation

1. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and configure your database settings.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   Run the migrations and seed the database with an initial admin user and sample data.
   ```bash
   php artisan migrate --seed
   ```

4. **Storage Link**
   Create a symbolic link from `public/storage` to `storage/app/public` for item images.
   ```bash
   php artisan storage:link
   ```

5. **Start the Server**
   ```bash
   php artisan serve
   ```

## 🔐 Default Credentials (if seeded)

- **Email**: `admin@ceyntics.com`
- **Password**: `password` (or as configured in seeder)

## 📡 API Endpoints

The API is structured around several core resources:
- `/api/login` - Authentication
- `/api/inventory-items` - Item Management
- `/api/borrowings` - Borrowing Lifecycle
- `/api/cupboards` & `/api/places` - Storage Structure
- `/api/activity-logs` - Audit Logs (Admin Only)

## 🧪 Testing

The system includes a comprehensive suite of feature tests covering all API endpoints and business logic.

Run the tests using Artisan:
```bash
php artisan test
```

Current test coverage includes:
- **Authentication**: Login/Logout flows.
- **Inventory**: CRUD operations, search filtering, and image handling.
- **Borrowing**: Process flow (borrow/return) with stock validation and pessimistic locking.
- **Storage**: Cupboard and Place management.
- **Admin**: User management and Activity Log auditing.

## 🏗️ Architecture Features


- **Pessimistic Locking**: Uses `lockForUpdate()` for stock-critical transactions.
- **Polymorphic Logging**: Activity logs use a generic trait for system-wide auditability.
- **API Resources**: Data transformation for consistent JSON output.
- **Automated Testing**: Comprehensive feature test suite with 100+ assertions.
- **Form Requests**: Decoupled validation logic.

---
Developed by **Ants Sanjeewa** · © 2026 Ceyntics Systems (Pvt) Ltd.
