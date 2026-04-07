# 🌐 Unsynth
## Description
Unsynth is a web-based application built using React, Vite, and MongoDB for music album and song reviews

---

# ⚙️ Repository Setup

## 1️⃣ Install Node.js

Download and install the **latest Node.js LTS version**.

[https://nodejs.org/](https://nodejs.org/)

Verify installation:

```
node -v
npm -v
```

---

## 2️⃣ Clone Repository

```
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

---

## 3️⃣ Install Dependencies

Inside the repository:

```
npm install
npm install @syncfusion/ej2-react-richtexteditor --save
```

---

## 4️⃣ Setup environment variables

Each contributor must create an ``.env`` file containing the following

```
PORT=5001
MONGO_URL=mongodb://<username>:<password>@<cluster-hosts>/<database-name>?options
SESSION_SECRET=your_random_secret_string
```
⚠️ **Important:** Never commit or upload your .env file to the repository.
Make sure .env is included in your .gitignore file. 

## 5️⃣ Setup MongoDB Atlas Account
Log in to MongoDB Atlas at [mongodb.com](https://www.mongodb.com/) and accept the project invitation as a collaborator. Then, create a new database user or request credentials from an existing one to use for your ``MONGO_URL``.

**📝 Notes**
* Make sure your database user has the necessary permissions (e.g., read/write access).
* You can find your connection string in Database → Connect → Drivers.
* Replace the placeholders in your .env file with your actual credentials.

## 6️⃣ Run the App Locally for Testing and Debugging

Start the development server:

```
cd server
node server.js
cd ..
npm run dev
```

The application will run at:

```
http://localhost:5173
```
---

# 📦 Dependencies

## React + Vite

This project uses **React with Vite** for fast development and Hot Module Replacement (HMR).

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

* **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)**
  Uses **Babel** (or **oxc** when used in rolldown-vite) for Fast Refresh.

* **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)**
  Uses **SWC** for Fast Refresh.

---

## React Compiler

The **React Compiler** is enabled in this template.

Documentation:
[https://react.dev/learn/react-compiler](https://react.dev/learn/react-compiler)

> Note: This may impact Vite development and build performance.

---

## ESLint Configuration

For production applications, it is recommended to use **TypeScript with type-aware lint rules**.

Refer to the React + TypeScript Vite template:
[https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)

---

## Database

This project uses **MongoDB Atlas** as its database for storing and retrieving application data.

MongoDB allows flexible document-based storage and integrates easily with JavaScript applications.

Typical usage includes:

* Storing application data
* Managing user-generated content
* Backend API data persistence

## Render

This app is deployed using render. The set-up for the project is as follows:
*  **Deployment Branch:** deployment
*  **Build Command:** npm install --include=dev && npm run build
*  **Start Command:** npm start

*All other dependencies and external libraries are found in package.json*

---

# 📁 `src` Organization

The `src` folder contains the main source code of the application.
A recommended structure is shown below:

```
src/
│
├── api/             # API calls and database interaction logic
├── assets/          # Images, icons, and static files
├── components/      # Reusable UI static components
├── features/        # Reusable UI data-heavy components
├── layouts/         # Website layout 
├── modals/          # Data or feature heavy modals
├── pages/           # Page-level components / views
│
├── App.jsx          # Root React component
├── main.jsx         # Application entry point
└── index.css        # Global styles
```

### Folder Descriptions

**assets**
Contains static resources such as images, fonts, or icons used throughout the application.

**components**
Reusable UI components that can be used across multiple pages.

**features**
Reusable UI data heavy components that can be used across multiple pages.

**pages**
High-level page components that represent different routes or screens in the application.

**api**
Handles communication with APIs or backend services (including MongoDB-related endpoints).

**hooks**
Custom React hooks for reusable state and logic.

---

# 🧑‍💻 Tech Stack

* **Frontend:** React, Vite, CSS, Bootstrap Icons
* **Backend / API:** Node.js, Expres.js, lyrics.ovh API
* **Database:** MongoDB, Mongoose
* **Rich Text Editor:** Syncfusion React Rich Text Editor
* **Authentication & Security** bcrypt
* **Media Management** Cloudinary
* **Deployment** Render.io

---

# 💻 Contributors

* **Joshua Calibo**
* **Jessica Dela Cruz**
* **Shielo Lunario**
* **Jianna Moraga**
