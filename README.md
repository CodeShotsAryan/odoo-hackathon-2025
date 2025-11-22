# 📦 inventrivia – Inventory & Warehouse Management System

**inventrivia** is a modular and scalable Inventory & Warehouse Management System built using **Next.js** (Frontend) and **FastAPI** (Backend). It replaces slow manual stock tracking with a fast, centralized, real-time system.

---

## 👥 Team

| Role | Name |
| :--- | :--- |
| **Team Leader** | Aryan Patil |
| **Team Member** | Sanket Bhandari |
| **Team Member** | Swaraj Kanse |
| **Team Member** | Raj Ghorpade |
| **Reviewer** | Aman Patel (ampa) |

---

## 📝 Problem Statement

The goal is to build a modular **IMS (Inventory Management System)** that digitizes and streamlines all stock-related operations inside a business. The system eliminates manual registers, Excel sheets, and inconsistent tracking by offering:

* ✅ **Real-time data**
* ✅ **Centralized stock control**
* ✅ **Easy-to-use UI**
* ✅ **Secure authentication**

### 🎯 Target Users
* **Inventory Managers:** Handle inward/outward stock decisions.
* **Warehouse Staff:** Handle transfers, picking, shelving, and counting.

---
![WhatsApp Image 2025-11-22 at 14 08 17_3c320efc](https://github.com/user-attachments/assets/a2f7c4af-13c3-46fc-98fb-78e7fe577456)

## 🚀 Features

### 🖥️ Dashboard
* Snapshot of all warehouse operations.
* **KPI Cards:** Total products, Low/out-of-stock items, Pending receipts, Pending deliveries.
* Dynamic analytics for internal transfers and warehouse summaries.

### 🔐 Authentication
* User Signup/Login.
* OTP-based password reset.
* Secure redirect to the dashboard upon login.

### 📦 Product Management
* Create and Update products.
* Manage SKU, Category, Unit of Measure (UoM), and Initial Stock.
* Set automatic reorder rules.

### 📊 Stock Overview
* View stock by **Warehouse** & **Location**.
* Global search, filtering, and sorting capabilities.

### 🏢 Warehouse & Location Management
* Support for a multi-warehouse structure.
* Manage internal racks and specific shelf locations.

### 📥 Operations (Inward/Outward)
* **Receipts (Incoming):** Add vendor details, select products, and validate to increase stock.
* **Deliveries (Outgoing):** Pick → Pack → Validate workflow with automatic stock deduction.

### 🔁 Internal Transfers & Adjustments
* **Transfers:** Move items between racks or different warehouses with logged movement history.
* **Adjustments:** Correct physical vs. recorded stock discrepancies (Audit-tracked).

### 📜 Move History
* Complete log of all stock movements.
* Viewable via **Table** and **Kanban** views.

---

## 🧪 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js, TypeScript, Tailwind CSS, Axios, React Context API |
| **Backend** | FastAPI, PostgreSQL, SQLAlchemy, Pydantic, JWT Auth |

---

## 📁 Project Structure

### Frontend (Next.js)
```text
client/
├── app/
├── components/
├── pages/
├── public/
├── styles/
├── utils/
├── package.json
└── next.config.js
