# Deployment Guide for mirabeautytouch.com on Hostinger

This guide explains how to get **mirabeautytouch.com** live on **Hostinger** in 2 minutes.

---

## 📦 What Has Been Prepared

A deployment package tailored for **`mirabeautytouch.com`** is ready:
- **`hostinger-deploy.zip`** (located in your project root)
- Contains:
  - React production build with root-relative asset routing (`/assets/index.js`, `/assets/index.css`)
  - All authentic salon video showcases & perfume photography (`media/`)
  - Complete modern PHP 8 backend (`php-server/`)
  - Pre-seeded SQLite database (`miras_beauty_touch.db`)
  - Custom `.htaccess` preconfigured for `mirabeautytouch.com` with HTTPS redirection, JWT header preservation, API routing, and SPA navigation

---

## 🚀 Easy 4-Step Upload in Hostinger hPanel

### Step 1: Log in & Open File Manager
1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com/).
2. Under **Websites**, find **`mirabeautytouch.com`** and click **Manage**.
3. Under the **Files** section, click **File Manager** (choose `public_html`).

### Step 2: Clear any Default Placeholder
1. Inside `public_html`, if you see a default placeholder file like `default.php`, delete it.

### Step 3: Upload `hostinger-deploy.zip`
1. Click the **Upload** button (arrow pointing up in the top right menu).
2. Select **File**, then choose:
   `hostinger-deploy.zip` from your project folder on your Desktop:
   `C:\Users\DELL-7420\OneDrive\Desktop\Mira's Beauty Touch22\hostinger-deploy.zip`
3. Wait for the upload bar to complete 100%.

### Step 4: Extract
1. Right-click on `hostinger-deploy.zip` in File Manager.
2. Select **Extract**.
3. In the destination field, type: `.` (or leave it as `/public_html`).
4. Click **Extract**.
5. Once extracted, you can delete the `.zip` file to keep your storage tidy.

---

## ⚙️ Hostinger PHP Configuration Check
1. In Hostinger hPanel, go to **Advanced > PHP Configuration**.
2. Confirm the PHP version is **PHP 8.1**, **PHP 8.2**, or **PHP 8.3**.
3. Under **PHP Extensions**, confirm `pdo_sqlite` and `openssl` are enabled (default in Hostinger).

---

## 🔒 Free SSL Activation (HTTPS)
1. In Hostinger hPanel, search for **SSL** (or go to **Security > SSL**).
2. Ensure **Lifetime Free SSL** is active for `mirabeautytouch.com`.

---

## 🎉 Live URLs on mirabeautytouch.com

Once extracted:
- **Main Website**: `https://mirabeautytouch.com/`
- **Hair & Braiding Gallery**: `https://mirabeautytouch.com/gallery`
- **Book Appointment**: `https://mirabeautytouch.com/book`
- **Perfumes Boutique**: `https://mirabeautytouch.com/perfumes`
- **Admin Dashboard**: `https://mirabeautytouch.com/admin`
  - **Login Email**: `mirabeautytouch@gmail.com`
  - **Password**: `miratouch`
- **API Status**: `https://mirabeautytouch.com/api/health`
