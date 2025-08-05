# Snapsafe

Snapsafe is a modern, privacy-focused web application designed to help users securely manage, organize, and access their personal files and folders online. It offers a responsive interface and robust authentication, ensuring user data remains protected and easy to use.

---

## Key Features

- **User Authentication**
  - Secure signup and login using email and password.
  - Passwords are hashed and stored securely (bcrypt).
  - JWT-based authentication for all file management actions.
  - Session management: tokens are stored in cookies, with automatic expiry checks.

- **File & Folder Management**
  - Create, view, and organize files and folders in a hierarchical structure.
  - Root and nested folders supported.
  - Rename and delete folders, with confirmation dialogs for safety.
  - Individual file and folder access per user (isolated storage).

- **Responsive UI**
  - Built with React and TypeScript, styled for desktop and mobile.
  - Navigation bar with sign-in/sign-out support.
  - Dialogs for folder creation, deletion, and error handling.

- **Backend**
  - Node.js/Express server with modular API routes.
  - MongoDB data storage for user and file structures.
  - Secure cookie handling for tokens.
  - Middleware for verifying JWT tokens before file/folder access.

---

## How It Works

- **Signup/Login:** Users create an account or log in using their email/password. Upon successful authentication, a JWT token is issued and stored in a cookie.
- **File Structure:** Each user has their own isolated file/folder hierarchy in the database. The structure supports nested folders and files.
- **Folder Operations:** Users can create folders at any level, rename them, or delete them. The UI prompts for confirmation and handles errors gracefully.
- **Protected Routes:** All file management API endpoints require a valid JWT token, ensuring only authenticated users can access their data.

---

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Sonner (notifications)
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt, Cookies

---

## Getting Started

1. **Clone the repository**
    ```bash
    git clone https://github.com/annuraggg/Snapsafe
    ```

2. **Install dependencies**
    - For the server:
      ```bash
      cd server
      npm install
      ```
    - For the client:
      ```bash
      cd client
      npm install
      ```

3. **Set environment variables**
    - Configure MongoDB connection and JWT secret in the `.env` file on the server.

4. **Start the server and client**
    - Server:
      ```bash
      npm run start
      ```
    - Client:
      ```bash
      npm run dev
      ```

5. **Access the app**
    - Visit `http://localhost:5173` (default) in your browser.

---

## Author

- [@annuraggg](https://github.com/annuraggg)

---

Snapsafe is ideal for anyone looking for a simple, secure, and private way to manage files and folders in the cloud. 
