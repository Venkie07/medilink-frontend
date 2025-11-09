

-----

# 🏥 MediLink – Smart Healthcare Management System

[](https://opensource.org/licenses/MIT)
[](https://nodejs.org/)
[](https://render.com/)

**MediLink** is a full-stack, role-based healthcare management platform designed to create a **unified digital ecosystem** connecting patients, doctors, labs, pharmacies, and administrators. It enables **seamless communication**, appointment booking, report management, prescriptions, and medicine tracking, making healthcare efficient and accessible for all stakeholders.

> **Live Demo (coming soon\!):** [https://medilink-frontend-XXXX.onrender.com](https://www.google.com/search?q=https://medilink-frontend-XXXX.onrender.com)
> (Replace `XXXX` with your actual Render URL slug)

-----

-----

## 🧠 Overview

MediLink streamlines healthcare interactions through distinct user roles:

| Role | Core Functions |
| :--- | :--- |
| **Patients** | Register, book appointments, view prescriptions, and retrieve lab results. |
| **Doctors** | Manage appointments, create and share digital prescriptions, and maintain patient records. |
| **Labs** | Upload patient diagnostic reports and communicate results securely. |
| **Pharmacies**| View patient prescriptions digitally and handle medicine orders/inventory. |
| **Admins** | Oversee user management, track system activities, and monitor overall performance. |

-----

## ✨ Features

  * ✅ **Secure Authentication:** Robust JWT-based token system.
  * ✅ **Role-Based Access:** Distinct access control for Admin, Doctor, Patient, Lab, and Pharmacy.
  * ✅ **File Storage:** Seamless integration with **Supabase Storage** for secure handling of images, documents, and reports.
  * ✅ **Core Management:** Dedicated modules for Appointment Scheduling, Prescription Creation, and Patient Record Management.
  * ✅ **Scalable Architecture:** Deployed on **Render** with a **CORS-enabled REST API**.

-----

## 🧰 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML, CSS, JavaScript, Fetch API | Lightweight, vanilla front-end for maximum compatibility and speed. |
| **Backend** | **Node.js, Express.js** | Fast, unopinionated, minimalist web framework for Node.js. |
| **Database** | **Supabase (PostgreSQL)** | Open Source Firebase alternative for database and authentication. |
| **Security** | JWT, bcrypt | Token-based authentication and secure password hashing. |
| **Utilities** | Multer, dotenv | Handling file uploads and managing environment variables. |

-----

## 📂 Folder Structure

```
MediLink/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── assets/
    ├── js/
    │   ├── auth.js
    │   └── config.js
    ├── css/
    └── index.html
```

-----

## 🚀 Getting Started (Setup)

Follow these steps to set up and run the project locally.

### 1\. ⚙️ Backend Setup (Express + Supabase)

1.  **Clone the Backend Repository:**

    ```bash
    git clone https://github.com/Venkie07/medilink-backend.git
    cd medilink-backend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the `backend/` directory and add your keys (see [Environment Variables](https://www.google.com/search?q=%23-environment-variables) section for details).

4.  **Run the Server:**

    ```bash
    npm start
    # Backend will run at http://localhost:5000
    ```

### 2\. 💻 Frontend Setup (HTML/JS)

1.  **Clone the Frontend Repository:**

    ```bash
    git clone https://github.com/Venkie07/medilink-frontend.git
    cd medilink-frontend
    ```

2.  **Configure API URL:**
    Open `js/config.js` and update the `API_BASE_URL` to point to your running backend:

    ```javascript
    // For local testing:
    window.API_BASE_URL = 'http://localhost:5000/api';

    // For production (Render):
    // window.API_BASE_URL = 'https://medilink-backend-24jm.onrender.com/api';
    ```

3.  **Start the Frontend:**
    You can simply open `index.html` in your browser, or for a more professional local setup, use a lightweight HTTP server:

    ```bash
    npx serve .
    # Access the frontend at http://localhost:3000 (or similar)
    ```

-----

## 🔐 Environment Variables

A `.env` file must be created in the `backend/` root directory.

| Variable | Description | **Crucial Note** |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project URL. | Required for database connection. |
| `SUPABASE_KEY` | Supabase **Service Role** Key. | **Must be Service Role Key** on the server for security/uploads. |
| `JWT_SECRET` | A strong, random string for token signing. | Keep this secure and complex. |
| `PORT` | Backend port (e.g., `5000`). | Used for local development. |

-----

## 🧾 API Endpoints Overview

All routes are prefixed with `/api`.

| Route Category | Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/auth/register` | `POST` | Create a new user account. | Public |
| **Auth** | `/auth/login` | `POST` | Authenticate and get JWT token. | Public |
| **Doctor** | `/doctor/appointments` | `GET` | Fetch all appointments for the doctor. | Doctor |
| **Doctor** | `/doctor/prescription` | `POST` | Create a new prescription. | Doctor |
| **Patient** | `/patient/reports` | `GET` | Retrieve patient's lab reports. | Patient |
| **Lab** | `/lab/upload-report` | `POST` | Upload a new patient report. | Lab |
| **Admin** | `/admin/users` | `GET` | View all users for management. | Admin |

-----

## 🚀 Deployment (Render)

MediLink is designed for easy deployment on **Render**, utilizing its free tier for both Web Services (Backend) and Static Sites (Frontend).

### Backend Deployment (Web Service)

1.  Push your `medilink-backend` to GitHub.
2.  Go to [Render.com](https://render.com) and create a new **Web Service**.
3.  Connect the backend repository.
4.  Set the **Build Command** to `npm install`.
5.  Set the **Start Command** to `npm start`.
6.  **Crucially**, add your environment variables (`SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`) under **Settings → Environment**.

### Frontend Deployment (Static Site)

1.  Push your `medilink-frontend` to GitHub.
2.  Create a **Static Site** on Render.
3.  Ensure the `Publish Directory` is set to `/frontend` (or wherever your `index.html` resides).
4.  **Update `js/config.js`** in the frontend code to use the deployed Render backend URL.

-----

## 🧩 Common Issues & Fixes

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **Missing .env** | Environment variables not configured. | Create `.env` file and verify all keys are correct. |
| **CORS Error** | Frontend calling an incorrect or unauthorized API URL. | Ensure `window.API_BASE_URL` in `config.js` **exactly** matches the running backend URL. |
| **Invalid Token** | JWT is expired, malformed, or missing. | Clear browser `localStorage` to remove old tokens and log in again. |
| **Uploads Fail** | Incorrect Supabase permissions or key. | Double-check Supabase Storage policies and ensure the **Service Role** key is used for the backend. |

-----

## 👨‍💻 Contributors

**Developed with 💙 by:**

  * **Venkateswaran K (Kyro / Venkie)**
      * B.Tech Artificial Intelligence & Data Science,
      * Sri Sairam Institute of Technology, Chennai.

-----

## 🪪 License

This project is published under All Rights Reserved copyright. The source code is visible for review and reference only. No use, modification, copying, or distribution is permitted without explicit written permission from the author.

-----
