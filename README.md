# Church Management System (Jemaat & Pelayan)

A web application for managing church data, built with a React frontend and a native PHP backend.

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** PHP Native (PDO)
- **Database:** MySQL

## Prerequisites

- **Node.js** (v18+) & **npm**
- **PHP** (v8.0+) & **MySQL** (via XAMPP, Docker, or local server)

## Installation

### 1. Database Setup

1.  Create a MySQL database named `jemaat_gbkp`.
2.  Import the provided SQL schema/data (if available) or ensure the necessary tables are created.
3.  Configure the database connection in `api/db.php`:
    ```php
    $host = 'localhost';
    $db   = 'jemaat_gbkp';
    $user = 'root'; // Adjust to your database username
    $pass = '';     // Adjust to your database password
    ```

### 2. Backend Setup

Ensure your web server (Apache/Nginx) points to the project directory or is serving the `api` folder.
- **Verify:** Access `http://localhost/your-project/api/check_server.php` to confirm PHP and Database connection.

### 3. Frontend Setup

1.  Open a terminal in the project root.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Troubleshooting

- **Database Connection Error:** Check credentials in `api/db.php` and ensure the `jemaat_gbkp` database exists.
- **CORS Issues:** Ensure the backend `db.php` allows requests from your frontend URL (e.g., `http://localhost:5173`).
- **Reset Admin:** If locked out, access `/api/reset_admin.php` to generate default admin credentials (`admin@gbkp.com` / `admin123`).
