# Implementation Documentation

**Project:** Ceyntics ERP — Inventory Management System  
**Developer:** Ants Sanjeewa  
**Date:** April 2026  
**Tech Stack:** Laravel 12 (API Backend) · Next.js 15 (Frontend) · PostgreSQL  

---

## Table of Contents

1. [Project Overview & Assumptions](#1-project-overview--assumptions)
2. [Architecture Overview](#2-architecture-overview)
3. [Database Schema Design](#3-database-schema-design)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Storage Structure Management](#5-storage-structure-management)
6. [Inventory Item Management](#6-inventory-item-management)
7. [Borrowing System & Concurrency Handling](#7-borrowing-system--concurrency-handling)
8. [Audit / Activity Logging](#8-audit--activity-logging)
9. [Frontend Architecture](#9-frontend-architecture)
10. [API Design & Error Handling](#10-api-design--error-handling)
11. [Security Considerations](#11-security-considerations)

---

## 1. Project Overview & Assumptions

### Objective

Build a secure, internal-only Inventory Management System for Ceyntics Systems (Pvt) Ltd to track tools, products, and electronic components across physical storage locations within the organization.

### Key Assumptions

1. **Single-tenant system** — This is designed for one organization. There is no multi-tenancy or organization switching.
2. **No public registration** — Users are exclusively created by administrators. There is no self-signup endpoint or public-facing registration form.
3. **Two roles only** — The system supports `admin` and `staff` roles. Admins have full access to user management and audit logs. Staff members can manage inventory, storage, and borrowing but cannot access administrative functions.
4. **Borrowing by third parties** — Borrowers are external parties (not system users). They are recorded by name and contact details rather than having user accounts.
5. **Quantity is a single integer** — Each inventory item has one quantity field representing the total available stock. When items are borrowed, this quantity is decremented; when returned, it is incremented back.
6. **Image storage** — Item images are stored on the local filesystem using Laravel's `public` disk. In a production deployment, this would be swapped for S3 or similar cloud storage via Laravel's filesystem abstraction.
7. **Soft Deletes** — All core entities (Users, Inventory Items, Borrowings, Cupboards, Places, Activity Logs) use soft deletes. Records are never permanently removed from the database, preserving historical integrity and auditability.

---

## 2. Architecture Overview

### Separation of Concerns

The project follows a **decoupled architecture** with a clear separation between the backend API and the frontend application:

```
inventory-system/
├── backend/          # Laravel 12 — RESTful JSON API
│   ├── app/
│   │   ├── Enums/           # PHP 8.1 Backed Enums (ItemStatus)
│   │   ├── Http/
│   │   │   ├── Controllers/API/   # Resource controllers
│   │   │   ├── Middleware/        # Role-based access middleware
│   │   │   ├── Requests/API/      # Form request validators
│   │   │   └── Resources/        # API resource transformers
│   │   ├── Models/          # Eloquent models with relationships
│   │   ├── Providers/       # Service provider (API response macros)
│   │   └── Traits/          # Reusable traits (LogsActivity)
│   ├── database/
│   │   └── migrations/      # Schema definitions
│   └── routes/
│       └── api.php          # API route definitions
│
└── frontend/         # Next.js 15 — React SPA
    ├── app/
    │   ├── (root)/          # Login page (unauthenticated layout)
    │   └── (home)/          # Authenticated pages (with sidebar/topbar)
    │       ├── dashboard/
    │       ├── inventory/
    │       ├── borrowing/
    │       ├── storage/
    │       ├── users/
    │       └── audit-logs/
    ├── components/          # Shared UI components
    ├── services/            # API service layer
    └── lib/                 # Utilities (auth, api client, alerts)
```

### Why This Architecture?

- **Laravel as API-only** — Laravel excels at backend concerns: database management, validation, authentication (Sanctum), and business logic. Keeping it API-only avoids mixing concerns with frontend rendering.
- **Next.js for Frontend** — Provides file-based routing, server-side rendering capabilities, and a modern React developer experience. The route grouping feature (`(root)` vs `(home)`) cleanly separates authenticated and unauthenticated layouts.
- **PostgreSQL** — Chosen for its native `jsonb` support (used for audit log values), robust transaction handling with row-level locking (`FOR UPDATE`), and strong data integrity features.

---

## 3. Database Schema Design

### Entity Relationship Diagram

```
┌──────────┐       ┌──────────┐       ┌──────────────────┐
│  users   │       │cupboards │       │     places       │
├──────────┤       ├──────────┤       ├──────────────────┤
│ id (PK)  │       │ id (PK)  │◄──────│ cupboard_id (FK) │
│ name     │       │ name     │   1:N │ id (PK)          │
│ email    │       │ timestamps│      │ name             │
│ password │       │ soft_del │       │ timestamps       │
│ role     │       └──────────┘       │ soft_del         │
│ timestamps│                         └────────┬─────────┘
│ soft_del │                                   │ 1:N
└────┬─────┘                                   ▼
     │                                ┌──────────────────┐
     │                                │ inventory_items  │
     │                                ├──────────────────┤
     │                                │ id (PK)          │
     │                                │ item_name        │
     │                                │ code (UNIQUE)    │
     │                                │ quantity          │
     │                                │ serial_number    │
     │                                │ image            │
     │                                │ description      │
     │                                │ place_id (FK)    │
     │                                │ status (ENUM)    │
     │                                │ timestamps       │
     │                                │ soft_del         │
     │                                └────────┬─────────┘
     │                                         │ 1:N
     │                                         ▼
     │                                ┌──────────────────┐
     │                                │   borrowings     │
     │                                ├──────────────────┤
     │                                │ id (PK)          │
     │                                │ inventory_item_id│
     │                                │ borrower_name    │
     │                                │ contact          │
     │                                │ borrow_date      │
     │                                │ expected_return   │
     │                                │ quantity          │
     │                                │ status           │
     │                                │ timestamps       │
     │                                │ soft_del         │
     │                                └──────────────────┘
     │
     │ 1:N (user_id)
     ▼
┌───────────────────────┐
│    activity_logs      │
├───────────────────────┤
│ id (PK)               │
│ user_id (FK)          │
│ action                │
│ entity_type (morph)   │
│ entity_id   (morph)   │
│ old_values (JSONB)    │
│ new_values (JSONB)    │
│ created_at            │
│ soft_del              │
└───────────────────────┘
```

### Key Schema Decisions

#### Foreign Key Constraints with `onDelete('restrict')`

All foreign keys use `restrict` instead of `cascade`:

```php
$table->foreignId('place_id')->constrained()->onDelete('restrict');
$table->foreignId('cupboard_id')->constrained()->onDelete('restrict');
$table->foreignId('inventory_item_id')->constrained()->onDelete('restrict');
$table->foreignId('user_id')->constrained()->onDelete('restrict');
```

**Rationale:** In an inventory system, accidentally deleting a cupboard should not silently cascade-delete all its places and items. The `restrict` constraint forces the operator to relocate or remove child records first, preventing accidental data loss. This is a deliberate data integrity safeguard.

#### Status as Database ENUM

```php
$table->enum('status', ['In-Store', 'Borrowed', 'Damaged', 'Missing'])->default('In-Store');
```

Using a database-level `ENUM` ensures that invalid status values cannot be inserted even if application validation is bypassed. This is complemented by a PHP Backed Enum (`ItemStatus`) for type-safe usage in application code.

#### JSONB for Audit Values

```php
$table->jsonb('old_values')->nullable();
$table->jsonb('new_values')->nullable();
```

**Rationale:** Different entities have different fields. Rather than creating separate audit columns for every possible field, JSONB stores the complete before/after snapshot of any entity. PostgreSQL's native `jsonb` type allows efficient indexing and querying of these values if needed in the future.

#### Polymorphic Activity Logs

```php
$table->morphs('entity');  // Creates entity_type + entity_id columns
```

A single `activity_logs` table tracks changes across all entities (Users, Items, Borrowings) via Laravel's polymorphic relationship. This avoids creating separate log tables for each entity type while maintaining the ability to trace actions back to specific records.

---

## 4. Authentication & Authorization

### Authentication: Laravel Sanctum

**Decision:** I chose Laravel Sanctum over JWT for token-based API authentication.

**Rationale:**
- Sanctum is Laravel's first-party solution, fully integrated with the framework's authentication system.
- It provides simple token issuance via `createToken()` without requiring third-party packages.
- Tokens are stored in the `personal_access_tokens` table and can be revoked individually (important for logout).
- Sanctum is designed for first-party SPA/API architectures, which matches our use case exactly.

**Login Flow:**
1. User submits email + password to `POST /api/login`
2. Backend validates credentials via `Auth::attempt()`
3. On success, a Sanctum personal access token is created and returned
4. Frontend stores the token in `localStorage` and attaches it as a `Bearer` token on all subsequent API requests via an Axios interceptor
5. On logout, the frontend calls `POST /api/logout` which deletes the current access token on the server, then clears localStorage

**Password Security:**
```php
protected function casts(): array
{
    return [
        'password' => 'hashed',  // Automatic bcrypt hashing
    ];
}
```

Laravel's `hashed` cast automatically bcrypt-hashes passwords on assignment. Passwords are never stored or transmitted in plaintext.

### Authorization: Role-Based Access Control

**Implementation:** A custom `RoleMiddleware` checks the authenticated user's `role` field:

```php
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if ($request->user()->role !== $role) {
            return response()->apiError('Unauthorized', [], 403);
        }
        return $next($request);
    }
}
```

**Route Protection (Backend):**
```php
Route::middleware('auth:sanctum')->group(function () {
    // All authenticated users
    Route::apiResource('inventory-items', InventoryItemAPIController::class);
    Route::apiResource('borrowings', BorrowingAPIController::class);
    Route::apiResource('cupboards', CupboardAPIController::class);
    Route::apiResource('places', PlaceAPIController::class);

    // Admin only
    Route::apiResource('users', UsersAPIController::class)->middleware('role:admin');
    Route::get('activity-logs', [ActivityLogAPIController::class, 'index'])->middleware('role:admin');
});
```

**Frontend Protection (Defense in Depth):**
- An `AuthGuard` component wraps the authenticated layout — unauthenticated users are redirected to the login page.
- Admin-only pages (`/users`, `/audit-logs`) include a role check in their `useEffect` hooks that redirects non-admin users to the dashboard.
- The sidebar conditionally hides admin navigation links for staff users.

This layered approach means authorization is enforced at three levels: API middleware, React route guards, and UI visibility.

---

## 5. Storage Structure Management

### Hierarchy: Cupboards → Places

The physical storage structure is modeled as a two-level hierarchy:

- **Cupboard** — A physical storage unit (e.g., "Electronics Cabinet A")
- **Place** — A specific location within a cupboard (e.g., "Shelf 3", "Drawer B")

Each `Place` belongs to exactly one `Cupboard` (enforced by `cupboard_id` foreign key), and each `InventoryItem` is stored in exactly one `Place` (enforced by `place_id` foreign key).

**Decision:** I kept the hierarchy flat (two levels) rather than supporting arbitrary nesting. The assignment specifies "Cupboards" and "Places inside cupboards," and over-engineering a recursive tree structure would add unnecessary complexity.

### UI Design: Master-Detail Pattern

The Storage page uses a master-detail layout:
- Left panel: List of cupboards (selectable)
- Right panel: Places belonging to the selected cupboard, with CRUD actions

This pattern provides contextual navigation — the user always sees which cupboard they're working within.

---

## 6. Inventory Item Management

### Data Model

Each inventory item contains all fields specified in the requirements:

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| `item_name` | string | required | Human-readable name |
| `code` | string | unique, required | Unique item identifier |
| `quantity` | integer | min: 0 | Available stock count |
| `serial_number` | string | nullable | Optional hardware serial |
| `image` | string | nullable | Path to uploaded image |
| `description` | text | nullable | Detailed item description |
| `place_id` | FK | required, exists | Storage location reference |
| `status` | enum | required | Current item state |

### Status Management

Item status is managed via a PHP Backed Enum:

```php
enum ItemStatus: string
{
    case IN_STORE = 'In-Store';
    case BORROWED = 'Borrowed';
    case DAMAGED = 'Damaged';
    case MISSING  = 'Missing';
}
```

**Status transitions are governed by business logic:**
- When an item is created, it defaults to `In-Store`.
- When all units of an item are borrowed (quantity reaches 0), the status automatically transitions to `Borrowed`.
- When borrowed units are returned and the item was in `Borrowed` status, it automatically reverts to `In-Store`.
- `Damaged` and `Missing` statuses are set manually by operators.

### Image Handling

- Images are uploaded via `multipart/form-data` and stored on Laravel's `public` disk.
- The `InventoryItemResource` transforms the stored path into a full URL using `asset('storage/' . $this->image)`.
- On update, the old image file is deleted from disk after the new one is successfully saved, preventing orphan files.
- For update requests that include file uploads, the frontend uses `POST` with `_method: PUT` because HTTP `PUT` does not natively support `multipart/form-data` in PHP.

### Filtering & Search

The inventory list supports server-side filtering:
- **Text search** — Matches against `item_name` and `code` using `LIKE` queries
- **Status filter** — Exact match on the status enum value
- **Location filter** — Cascading cupboard → place filter with dynamic place loading

---

## 7. Borrowing System & Concurrency Handling

### Borrow Flow

The borrowing process is the most critical business operation in the system. Here is the complete flow:

**Creating a Borrowing (Borrow):**

```
1. Validate request data (borrower name, contact, dates, quantity, item ID)
2. BEGIN TRANSACTION
3. Lock the inventory item row with SELECT ... FOR UPDATE
4. Check: Does the item have sufficient stock?
   - No → Return 422 error, ROLLBACK
   - Yes → Continue
5. Create the Borrowing record with status = 'Borrowed'
6. Decrement the item's quantity atomically
7. If item quantity is now 0 → set item status to 'Borrowed'
8. Log the activity
9. COMMIT
```

**Processing a Return:**

```
1. Validate the status change (must be 'Borrowed' → 'Returned')
2. BEGIN TRANSACTION
3. Lock the Borrowing record with SELECT ... FOR UPDATE
4. Lock the associated Inventory Item with SELECT ... FOR UPDATE
5. Increment the item's quantity by the borrowed amount
6. If item status was 'Borrowed' → revert to 'In-Store'
7. Update the borrowing status to 'Returned'
8. Log the activity
9. COMMIT
```

### Concurrency Handling — Why `lockForUpdate()`?

**The Problem:**
In a multi-user environment, two staff members might simultaneously try to borrow the last available unit of an item. Without proper locking:

```
Time    User A                          User B
─────────────────────────────────────────────────────
T1      SELECT quantity → 1             
T2                                      SELECT quantity → 1
T3      quantity >= 1? YES → proceed    
T4                                      quantity >= 1? YES → proceed
T5      UPDATE quantity = 0             
T6                                      UPDATE quantity = -1  ← DATA CORRUPTION
```

Both users saw `quantity = 1` and both proceeded, resulting in a negative stock count.

**The Solution:**
Using `lockForUpdate()` within a database transaction acquires an exclusive row-level lock:

```php
return DB::transaction(function () use ($request) {
    $item = InventoryItem::where('id', $request->inventory_item_id)
        ->lockForUpdate()    // ← Acquires exclusive lock
        ->firstOrFail();

    if ($item->quantity < $request->quantity) {
        return response()->apiError('Insufficient stock available.', 422);
    }

    // ... proceed with borrow
});
```

With locking:
```
Time    User A                          User B
─────────────────────────────────────────────────────
T1      BEGIN TRANSACTION               
T2      SELECT ... FOR UPDATE (lock)    
T3                                      BEGIN TRANSACTION
T4                                      SELECT ... FOR UPDATE → BLOCKED (waiting)
T5      Check qty, decrement, COMMIT    
T6      Lock released                   
T7                                      Lock acquired, SELECT → quantity = 0
T8                                      Check qty: 0 < 1 → REJECT
```

User B is forced to wait until User A's transaction completes. When B finally reads the row, it sees the updated (decremented) quantity and correctly rejects the borrow attempt.

### Atomic Quantity Operations

Instead of reading the quantity into PHP, modifying it, and writing it back (which is vulnerable to race conditions even with locking in some scenarios), I use Eloquent's atomic `increment()` and `decrement()` methods:

```php
$item->decrement('quantity', $request->quantity);  // Atomic SQL: UPDATE ... SET quantity = quantity - N
$item->increment('quantity', $borrowing->quantity); // Atomic SQL: UPDATE ... SET quantity = quantity + N
```

These translate to single `UPDATE` statements at the database level, ensuring atomicity even under high concurrency.

---

## 8. Audit / Activity Logging

### Design: Polymorphic Trait

Audit logging is implemented as a reusable `LogsActivity` trait:

```php
trait LogsActivity
{
    public function logActivity($action, $oldValues = null, $newValues = null)
    {
        $this->activities()->create([
            'user_id' => auth()->id(),
            'action' => $action,
            'old_values' => $oldValues,
            'new_values' => $newValues,
        ]);
    }

    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'entity');
    }
}
```

**Decision: Trait vs. Observer vs. Event-based logging**

I chose a trait with explicit `logActivity()` calls over automatic Eloquent Model Observers for several reasons:

1. **Explicit control** — Not every model save should generate a log entry. For example, when the borrowing process updates an item's status, I want to log it as "Item Borrowed" (with the borrowing context), not as a generic "Item Updated."
2. **Custom action descriptions** — `'Inventory Item Created'`, `'Item Borrowed'`, `'Borrowing Status Updated'` are more meaningful than auto-generated `'created'`/`'updated'` strings.
3. **Old/New value control** — I can capture the exact snapshot of data that changed, including only the relevant fields, rather than logging the entire model state for every minor change.
4. **Performance** — Explicit calls mean no logging overhead on internal status updates or batch operations where logging isn't needed.

### What Is Logged

| Action | Trigger | Old Values | New Values |
|--------|---------|-----------|------------|
| Inventory Item Created | Item store | null | Full item data |
| Inventory Item Updated | Item update | Previous item state | Updated item state |
| Item Borrowed | Borrowing created | null | Borrowing record |
| Borrowing Status Updated | Status change | Previous borrowing state | Updated state |
| User Created | User store | null | User data (excl. password) |

### Frontend: Audit Detail Dialog

The audit logs page displays a table of all logged actions. Each row includes a "view details" button that opens a dialog showing the old and new values side-by-side in a structured, key-value format. This makes it easy for administrators to see exactly what changed.

---

## 9. Frontend Architecture

### Layout Strategy: Next.js Route Groups

Next.js route groups allow sharing layouts without affecting URL structure:

- **`(root)/`** — Contains the login page with a minimal, centered layout (no sidebar/topbar). Used for unauthenticated users.
- **`(home)/`** — Contains all authenticated pages wrapped in a layout with the sidebar navigation, top bar, and `AuthGuard` component.

This cleanly separates the authenticated and unauthenticated experiences without URL nesting.

### Service Layer Pattern

All API communication is abstracted through service modules in the `services/` directory:

```
services/
├── InventoryService.ts    # Inventory CRUD + filtering
├── BorrowingService.ts    # Borrow/return operations
├── StorageService.ts      # Cupboard + Place CRUD
├── userService.ts         # User management
├── ActivityService.ts     # Audit log retrieval
└── DashboardService.ts    # Dashboard statistics
```

**Decision:** Each service module owns:
- TypeScript interface definitions for the entity
- All API calls related to that entity
- Error handling (checking `res.data.success`)

This pattern keeps components lean — they call service functions and handle UI state, without embedding API logic.

### API Client with Interceptors

The Axios client (`lib/api.ts`) handles cross-cutting concerns:

```typescript
// Request interceptor — attaches auth token from localStorage
api.interceptors.request.use((config) => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).access_token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor — handles 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user");
            window.location.href = '/';  // Force redirect to login
        }
        return Promise.reject(error);
    }
);
```

**Rationale:** Token attachment and session expiry handling happen transparently. Individual service functions don't need to worry about authentication headers or expired sessions.

### Authentication Guard

```typescript
// components/AuthGuard.tsx
export default function AuthGuard({ children }) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const user = auth.getCurrentUser();
        if (!user) router.replace("/");
        else setChecked(true);
    }, []);

    if (!checked) return <PageLoading />;
    return <>{children}</>;
}
```

This component wraps the entire authenticated layout. It performs a synchronous check against localStorage on mount and redirects unauthenticated users to the login page. The `checked` flag prevents the authenticated UI from flickering during the check.

### Design System

The UI uses a Material Design-inspired token system defined in `globals.css`:

- **Color tokens** — `--color-primary`, `--color-surface-container`, `--color-on-surface`, etc. All colors use semantic naming rather than raw hex values, making theme changes trivial.
- **Dark mode** — The entire system uses a dark color scheme by default, as ERP applications are typically used for extended periods where dark mode reduces eye strain.
- **Typography** — Inter font family with ERP-optimized font sizes (smaller than typical web defaults) for information-dense layouts.
- **Tailwind CSS v4** — Tokens are defined using `@theme inline` directive, making them available as Tailwind utility classes.

---

## 10. API Design & Error Handling

### Consistent Response Format

All API responses follow a unified structure, implemented via response macros in `AppServiceProvider`:

**Success Response:**
```json
{
    "success": true,
    "message": "Inventory item created successfully",
    "data": { ... }
}
```

**Paginated Response:**
```json
{
    "success": true,
    "message": "Success",
    "data": [ ... ],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 15,
        "total": 72,
        "links": {
            "next": "http://...",
            "prev": null
        }
    }
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Insufficient stock available.",
    "errors": { ... }
}
```

**Decision:** Using response macros (`Response::macro()`) ensures consistency across all controllers without repeating the response structure. The `success` boolean provides a reliable flag for the frontend to determine response status without relying on HTTP status codes alone.

### Exception Handling

The global exception handler in `bootstrap/app.php` catches Laravel-thrown exceptions and normalizes them to the same `{ success, message, errors }` format:

- `ValidationException` → 422
- `AuthenticationException` → 401
- `NotFoundHttpException` → 404

This ensures the frontend always receives a predictable JSON structure, even for framework-level errors.

### API Resources

Eloquent API Resources (`InventoryItemResource`, `BorrowingResource`, etc.) transform model data into a controlled API shape. This decouples the internal database schema from the public API contract — columns can be renamed or relationships restructured without breaking frontend consumers.

---

## 11. Security Considerations

| Concern | Implementation |
|---------|---------------|
| **Password storage** | Bcrypt hashing via Laravel's `hashed` cast |
| **API authentication** | Laravel Sanctum bearer tokens |
| **Token invalidation** | Server-side token deletion on logout |
| **Input validation** | Laravel Form Request classes with strict rules |
| **SQL injection** | Eloquent ORM / query builder (parameterized queries) |
| **Mass assignment** | Explicit `$fillable` via PHP attributes |
| **CSRF** | Not applicable (stateless API with token auth) |
| **Authorization** | Backend middleware + Frontend route guards |
| **Data integrity** | FK constraints with `restrict`, DB transactions |
| **Soft deletes** | Records preserved for audit trail |
| **File uploads** | Validated type/size (`image|max:5120`) |
| **Session hijacking** | 401 interceptor clears localStorage on invalid token |

---

## Conclusion

This system was designed with three priorities:

1. **Data integrity** — Every stock modification runs inside a database transaction with row-level locking. Foreign key constraints prevent orphaned records. Soft deletes preserve history.
2. **Auditability** — A polymorphic activity log captures who did what, when, and exactly what changed. The old/new value snapshots enable full change reconstruction.
3. **Security in depth** — Authorization is enforced at the database level (constraints), the API level (middleware), and the UI level (route guards and conditional rendering).

The architecture choices reflect a pragmatic approach: using Laravel and Next.js for what they do best, keeping the database schema normalized but not over-abstracted, and implementing concurrency controls only where they're genuinely needed (stock operations) rather than applying blanket locking across all CRUD operations.
