# 🌐 Unsynth
## Description
A web-based application built using React, Vite, and MongoDB for music album and song reviews

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

## 4️⃣ Run the App

Start the development server:

```
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

This project uses **MongoDB** as its database for storing and retrieving application data.

MongoDB allows flexible document-based storage and integrates easily with JavaScript applications.

Typical usage includes:

* Storing application data
* Managing user-generated content
* Backend API data persistence

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
├── hooks/           # Custom React hooks
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

* **Frontend:** React + Vite
* **Backend / API:** Node.js 
* **Database:** MongoDB
* **Rich Text Editor:** Syncfusion React Rich Text Editor
