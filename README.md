# MediCare – Doctor Appointment Booking Platform

A full-stack healthcare web application that connects patients with doctors through a seamless appointment booking system, complete with role-based dashboards for patients, doctors, and admins.

## 🔗 Live Links

- **User Panel:** https://medical-care-frontend-two.vercel.app/
- **Admin / Doctor Panel:** https://medical-care-admin.vercel.app/

## ✨ Features

- **Role-based Dashboards** – separate, dedicated interfaces for patients, doctors, and admins
- **Appointment Booking** – patients can browse doctors by specialty and book available slots
- **AI Health Assistant** – an integrated chatbot powered by the Groq API (LLaMA 3.1) to answer health and appointment-related queries
- **Secure Payments** – online appointment payments handled via Razorpay
- **Cloud Image Management** – doctor profile photos and documents managed through Cloudinary
- **Doctor Management** – admins can add, edit, and manage doctor profiles and availability
- **Authentication** – secure login system for patients, doctors, and admins

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB
**Other Integrations:** Cloudinary (image storage), Razorpay (payments), Groq API (AI chatbot)
**Deployment:** Vercel (frontend & admin panel), Render (backend)

## 📂 Project Structure

```
MEDICAL-CARE/
├── admin/      # Admin & Doctor panel (React + Vite)
├── backend/    # Express.js REST API + MongoDB models
└── frontend/   # Patient-facing web app (React + Vite)
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or later)
- MongoDB instance (local or Atlas)
- API keys for Cloudinary, Razorpay, and Groq

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/rimsha249/MEDICAL-CARE.git
   cd MEDICAL-CARE
   ```

2. Install dependencies for each part
   ```bash
   cd backend && npm install
   cd ../admin && npm install
   cd ../frontend && npm install
   ```

3. Create a `.env` file in `backend/`, `admin/`, and `frontend/` with the required environment variables (MongoDB URI, Cloudinary credentials, Razorpay keys, Groq API key, JWT secret, etc.)

4. Run each app
   ```bash
   # Backend
   cd backend && npm run server

   # Admin/Doctor Panel
   cd admin && npm run dev

   # Frontend
   cd frontend && npm run dev
   ```

## 👩‍💻 Author

**Rimsha Ali**
[GitHub](https://github.com/rimsha249) | [LinkedIn](#)
