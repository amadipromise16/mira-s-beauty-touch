# Mira's Beauty Touch — Modern PHP REST API Backend

A clean, high-performance, modern PHP (8.0+) REST API backend mirroring 100% of the Node.js/Express backend functionality for **Mira's Beauty Touch (Owerri, Imo State)**.

---

## 🌟 Architecture & Features

- **Modern Architecture**: Clean Model-View-Controller / Router-Controller-Middleware structure adhering to PSR-4 autoloading standards.
- **Self-Contained Autoloader**: Included `src/autoload.php` allows zero-dependency startup out of the box (works without needing Composer installed).
- **SQLite Database with PDO**: Automated table creation, migrations, and relationship indexing via SQLite PDO (`miras_beauty_touch.db`).
- **Cryptographic Security**: Native `password_hash()` (BCrypt cost 10) binary-compatible with `bcryptjs`.
- **Stateless JWT Authentication**: Clean HMAC-SHA256 JWT generator and validator (`Jwt.php`) compatible with the Node.js `jsonwebtoken` token claims (`id`, `email`, `role`).
- **Role-Based Middleware**: `AuthMiddleware` provides `requireAuth`, `requireAdmin`, and `optionalAuth` protection.
- **Media Asset Streaming**: Built-in support for streaming MP4 videos and images directly from `/media/` and `/uploads/`.
- **CORS Preflight & JSON**: Automatic CORS header negotiation (`OPTIONS` preflight, `application/json; charset=utf-8`).

---

## 📁 Directory Structure

```
php-server/
├── bin/
│   └── seed.php                     # CLI database seeder
├── public/
│   ├── .htaccess                    # Apache URL rewrite rules
│   └── index.php                    # Front controller & REST API router
├── src/
│   ├── autoload.php                 # Native PSR-4 compatible autoloader
│   ├── Config/
│   │   ├── Config.php               # Environment configuration (.env loader)
│   │   └── Database.php             # SQLite PDO singleton connection
│   ├── Controllers/
│   │   ├── AdminController.php      # Admin analytics, appointments, users, settings
│   │   ├── AppointmentsController.php # Customer booking, cancellation, availability
│   │   ├── AuthController.php       # Registration, login, profile, password reset
│   │   ├── GalleryController.php    # Gallery listings, 1-like-per-user toggle, admin upload
│   │   ├── NotificationsController.php # In-app notifications & read receipts
│   │   ├── PerfumesController.php   # Luxury perfumes catalog, filtering, admin CRUD
│   │   └── ServicesController.php   # Salon services catalog, categories, admin CRUD
│   ├── Database/
│   │   ├── Schema.php               # Complete SQLite table definitions & indexes
│   │   └── Seeder.php               # Demo users, services, perfumes, gallery & settings
│   ├── Middleware/
│   │   └── AuthMiddleware.php       # requireAuth, requireAdmin, optionalAuth
│   ├── Router/
│   │   └── Router.php               # Lightweight, regex-based REST API router
│   └── Utils/
│       ├── Jwt.php                  # Pure PHP JWT generator & validator
│       ├── Request.php              # HTTP request, query, header, & JSON parser
│       └── Response.php             # Standardized JSON response & CORS helper
├── uploads/                         # Uploaded files directory
├── .env                             # Environment configuration file
├── .env.example                     # Environment template
├── .htaccess                        # Root Apache fallback rewrite
├── composer.json                    # Composer configuration with PSR-4
├── nginx.conf.example               # Production Nginx server block template
└── README.md                        # Documentation
```

---

## 🚀 Getting Started

### Requirements
- **PHP 8.0+**
- PHP Extensions: `pdo`, `pdo_sqlite`, `openssl`, `json`

### 1. Configuration
Check or customize `.env`:
```env
PORT=5000
JWT_SECRET=miras_beauty_touch_super_secure_jwt_secret_key_2026
FRONTEND_URL=http://localhost:5173
DB_PATH=miras_beauty_touch.db
APP_ENV=development
```

### 2. Start the Server
Run with the PHP built-in web server:
```bash
# From within the php-server/ directory:
php -S localhost:5000 -t public
```
Or via composer (if installed):
```bash
composer start
```

### 3. Database Seeding
The database auto-seeds on first request if empty. You can also re-seed anytime via CLI:
```bash
php bin/seed.php
```

---

## 🔑 Default Credentials

| Role | Email | Password | Phone |
|---|---|---|---|
| **Admin** | `mirabeautytouch@gmail.com` | `miratouch` | `+234 903 727 6804` |
| **Demo Client** | `client@example.com` | `ClientPass123!` | `+234 814 987 6543` |

---

## 📡 API Endpoint Reference

### Health Check
- `GET /api/health` — System status, brand name, timestamp

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new client account
- `POST /api/auth/login` — Login client or admin, receive JWT
- `GET /api/auth/me` — Retrieve current authenticated profile & unread count
- `POST /api/auth/forgot-password` — Request a 1-hour password reset token
- `POST /api/auth/reset-password` — Set a new password using reset token
- `PUT /api/auth/profile` — Update customer name or phone

### Services (`/api/services`)
- `GET /api/services` — List active services (optional `category`, `search` query params)
- `GET /api/services/categories` — Distinct list of service categories
- `GET /api/services/:id` — Get service details
- `POST /api/services` — *(Admin)* Create a new salon service
- `PUT /api/services/:id` — *(Admin)* Update service
- `DELETE /api/services/:id` — *(Admin)* Delete service

### Perfumes (`/api/perfumes`)
- `GET /api/perfumes` — List active perfumes (optional `brand`, `search`, `sort`, `featured`)
- `GET /api/perfumes/brands` — Distinct perfume brands
- `GET /api/perfumes/:id` — Get perfume details
- `POST /api/perfumes` — *(Admin)* Add new perfume
- `PUT /api/perfumes/:id` — *(Admin)* Update perfume
- `DELETE /api/perfumes/:id` — *(Admin)* Delete perfume

### Gallery (`/api/gallery`)
- `GET /api/gallery` — Get curated salon photos and videos with like counts and user like status
- `POST /api/gallery/:id/like` — *(Authenticated)* Toggle like on gallery item (strictly 1 like per user)
- `POST /api/gallery` — *(Admin)* Add new media item
- `DELETE /api/gallery/:id` — *(Admin)* Delete media item

### Appointments (`/api/appointments`)
- `POST /api/appointments` — *(Authenticated)* Submit appointment request with double-booking prevention
- `GET /api/appointments/my-bookings` — *(Authenticated)* Customer's appointment history
- `POST /api/appointments/:id/cancel` — *(Authenticated)* Cancel a pending appointment
- `GET /api/appointments/availability?date=YYYY-MM-DD` — Check booked slots for a given date

### Notifications (`/api/notifications`)
- `GET /api/notifications` — *(Authenticated)* List user notifications and unread badge count
- `PUT /api/notifications/:id/read` — *(Authenticated)* Mark notification as read
- `PUT /api/notifications/read-all` — *(Authenticated)* Mark all notifications as read

### Admin Panel (`/api/admin`) *(Requires Admin Role)*
- `GET /api/admin/stats` — Overview metrics (total clients, revenue, pending/approved appointments)
- `GET /api/admin/appointments` — List all salon appointments with filtering and search
- `PUT /api/admin/appointments/:id/approve` — Approve booking & send customer confirmation notification
- `PUT /api/admin/appointments/:id/reject` — Reject booking with notes & notify customer
- `PUT /api/admin/appointments/:id/reschedule` — Reschedule booking with date/time & notify customer
- `PUT /api/admin/appointments/:id/complete` — Mark appointment as completed
- `DELETE /api/admin/appointments/:id` — Remove appointment record
- `GET /api/admin/users` — Client directory with booking counts
- `GET /api/admin/settings` — Get salon contact and operational settings
- `PUT /api/admin/settings` — Update site settings

