# 🌸 Mira’s Beauty Touch — Salon & Perfume

> **"Where Beauty Meets Elegance"**  
> *Beauty • Elegance • Confidence*  
> *✨ LOOK BEAUTIFUL. FEEL CONFIDENT. SHINE EFFORTLESSLY. ✨*

A complete, modern, professional, and responsive full-stack website and administrative platform built for **Mira’s Beauty Touch**, located in Nigeria.

---

## 📸 Design Alignment with Reference Assets

The application layout, warm color palette, typography, and interactive components directly follow the uploaded visual references:
1. **Home Experience** (`media_1793324344921_7e3305ce.jpg`): Sticky luxury navbar, warm cream & terracotta palette (`#B87D65`, `#FAF7F2`), social proof rating pill (⭐ 4.9/5 from 500+ clients), architectural arched service cards, embedded salon video spotlight, and perfume showcase.
2. **Services Showcase** (`media_1793324272419_8ba85fb4.jpg`): "EXPERIENCE MIRA’S: OUR SERVICES" header, category filter pills (*Hair Braiding, Manicures & Pedicures, Nail Enhancements, Professional Makeup, Eyelash Extensions, Fragrance & Wellness*), pricing in Nigerian Naira (`₦`), and *"Learn More & Book"* action.
3. **Appointment Booking** (`media_1793324272422_f92151f4.jpg`): 2-column layout matching the reference — left side with categorized service selector and stylist photo avatars; right side with interactive monthly calendar, dynamic time slots, auto-populated client details, and *"BOOK APPOINTMENT"* call-to-action.
4. **About Page** (`media_1793324272415_bf5099b6.jpg`): "OUR STORY: THE ART OF MIRA’S", salon interior showcase, Founder portrait of Mira Johnson, *"CERTIFIED & PASSIONATE EXPERTS"* team cards, and *"THE MIRA’S DIFFERENCE"* 3-pillar breakdown.
5. **Salon Video Showcase**: Embedded user-uploaded video (`WhatsApp_Video_2026-10-29_at_10.11.03_AM.mp4`) streamed directly in the salon spotlight banner and gallery.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Cormorant Garamond & Playfair Display typography.
- **Backend**: Node.js v24, Express, CORS, JSON Web Tokens (JWT), Bcrypt password hashing.
- **Database**: Native high-performance SQLite (`node:sqlite`) with ACID transactions, foreign keys, and unique database constraints.
- **Security**: Role-Based Access Control (RBAC), bcrypt 10-round salted password hashing, JWT authentication, and SQL injection protection.

---

## 💎 Key Features Implemented

### 1. Sticky Navigation Bar
- Fixed at the top across all pages with backdrop blur and warm aesthetic.
- Logo brand: **MIRA’S Beauty Touch • Salon & Perfume**.
- Unread notification bell with live counter badge.
- Customer account dropdown with direct links to *"My Appointments"* and *"Admin Dashboard"*.
- Mobile hamburger menu drawer with smooth transitions.

### 2. Database-Backed Gallery Like System
- **Mandatory Constraint Enforced**: Each authenticated user can contribute a maximum of **one active like per gallery item**.
- Unauthenticated visitors are prompted to sign in before liking.
- Toggling: Clicking like increments the count and records the user ID in the database; clicking again removes the like and decrements the count cleanly.
- Uniqueness constraint enforced at both the database level (`UNIQUE(user_id, gallery_item_id)`) and backend API.

### 3. Complete Appointment Booking & Approval Workflow
- **Customer Account Requirement**: Customers sign up or log in to submit appointments.
- **Availability Check**: Real-time checking prevents double-bookings for the same time slot.
- **Pending Submission**: Bookings are assigned a unique reference (e.g., `MBT-2026-XXXX`) with `pending` status.
- **Admin Approval**: Administrators approve or reschedule requests with confirmed dates and times.
- **Mandated In-App Notification**: When an appointment is approved, the customer receives the exact notification:  
  > *"Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for [date] at [time]."*

### 4. Perfume Boutique (Nigerian Naira ₦ Pricing)
- Exquisite flacons with fragrance notes breakdown (Top, Heart, and Base notes).
- All prices strictly displayed in Nigerian Naira with the `₦` symbol (e.g. `₦48,000`, `₦55,000`).
- **No Payment Gateway / Payment Page**: Directly complies with the prompt requirement; customers browse items and coordinate delivery/orders through direct WhatsApp and phone concierge.

### 5. Separate Admin Dashboard
- Live overview statistics derived from actual database records (Total clients, pending appointments, approved bookings, gallery likes, perfume products, services).
- Appointment management with status filters: *Pending, Approved, Completed, Rejected, All*.
- Actions: *Approve & Notify, Decline, Reschedule, Mark Completed, Delete*.
- Service and Perfume managers to add or edit catalog items and Naira prices.
- Customer directory with booking frequency.

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@mirasbeautytouch.com` | `AdminMira2026!` |
| **Client / Customer** | `client@example.com` | `ClientPass123!` |

*(The sign-in modal also includes "Fill Client" and "Fill Admin" one-click helper buttons for effortless testing).*

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18 or higher; v22/24 recommended)
- npm

### 1. Start the Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:5000
```
*Note: On first startup, the server automatically seeds all services, perfumes, gallery media, settings, and demo accounts.*

### 2. Start the Frontend Client
Open a second terminal:
```bash
cd client
npm run dev
# Web application available at http://localhost:5173
```

### 3. Run Automated End-to-End Tests
To verify all 41 test assertions:
```bash
npm test
# Or: node server/test-suite.js
```

---

## 📦 Deployment Instructions

1. **Backend**:
   - Deploy `server/` to Railway, Render, Fly.io, or DigitalOcean VPS.
   - Set environment variables (`PORT=5000`, `JWT_SECRET=your_jwt_secret`).
   - SQLite database persists in `server/miras_beauty_touch.db`.
2. **Frontend**:
   - Run `npm run build` in `client/`.
   - Deploy `client/dist/` to Vercel, Netlify, or serve statically from the Node.js backend.

