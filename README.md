# 🎓 ScholarStream

## 📌 Project Purpose
ScholarStream is a scholarship management platform that allows students to discover and apply for scholarships, moderators to review applications, and administrators to manage users, scholarships, and platform analytics.  
The goal is to streamline the entire scholarship application and payment process in one centralized system.

---

## 🌐 Live Website
🔗 **Live URL:** https://scholar-stream-app.web.app/

---

## 🚀 Key Features

### 👨‍🎓 Student Features
- Browse and search scholarships with filters (degree, category, country, fees, deadline)
- Apply for scholarships
- Secure payment via Stripe
- Track application and payment status
- Submit reviews after application completion

### 🧑‍🏫 Moderator Features
- View all scholarship applications
- Update application status (Pending / Completed / Rejected)
- Provide feedback to applicants
- View application details in modal view

### 🛠️ Admin Features
- Manage users (promote/demote roles, delete users)
- Add, edit, and delete scholarships
- View platform analytics:
  - Total users
  - Total scholarships
  - Total fees collected
  - Application distribution charts
- Control platform content securely

### 💳 Payment System
- Stripe Checkout integration
- Secure payment verification using session ID
- Payment success and failure pages
- Automatic payment status updates

---

## 📊 Analytics
- Bar / Pie charts showing application distribution
- Real-time data visualization using Recharts

---

## 🧰 Technologies Used

### Frontend
- React
- React Router
- Tailwind CSS
- DaisyUI
- Axios
- Recharts
- SweetAlert2

### Backend
- Node.js
- Express.js
- MongoDB
- Stripe API

---

## 📦 NPM Packages Used

### Frontend
- `react`
- `react-router-dom`
- `axios`
- `recharts`
- `sweetalert2`
- `styled-components`

### Backend
- `express`
- `mongodb`
- `stripe`
- `cors`
- `dotenv`

---

## 🔐 Authentication & Security
- Role-based access control (Student / Moderator / Admin)
- Secure payment verification via Stripe session ID
- Protected routes for dashboard access

---

## 📝 Notes
- Payment verification is handled server-side for security
- Sorting, filtering, and searching are processed on the server for performance
- Admin and moderator routes are protected

---

## Installation

```bash
git clone https://github.com/HasinIshrakK/scholar-stream-client
cd scholar-stream-client
npm install
npm start

```
