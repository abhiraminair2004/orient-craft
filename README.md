# 🛍️ OrientCraft – Full Stack E-commerce Web App

**OrientCraft** is a modern full-stack e-commerce platform built to showcase and manage handcrafted and fine jewelry. It features a beautiful storefront, secure authentication, cart functionality, and a fully-equipped admin panel for product and order management — built using the MERN stack and modern UI frameworks.

---

## 🌐 Live Demos

- **🛒 Main Website**: [https://orient-craft.vercel.app](https://orient-craft.vercel.app)
- **🛠️ Admin Panel**: [https://orient-craft-admin.vercel.app](https://orient-craft-admin.vercel.app)
- **🔗 Backend API**: `https://orient-backend.vercel.app`

---

## 🚀 Features

### 🛍️ Customer Side
- Product listing with search, sort, and filter
- Detailed product pages
- Add to cart and checkout flow
- User signup/login with JWT auth
- Responsive UI (mobile + desktop)

### 🛠️ Admin Panel
- Login-protected admin access
- Add, edit, delete products
- Upload product images (Cloudinary)
- View and manage orders (if enabled)
- Rich dashboard UI

### 🔧 System Features
- Modular backend with Express.js & MongoDB
- GitHub Actions CI for automated testing
- Environment-based configuration
- Vercel deployment for frontend and backend
- Clean and reusable component architecture

---

## 🧑‍💻 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Admin Panel
- React.js (separate app)
- Tailwind CSS / ShadCN UI
- Auth-protected routes
- Form validation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- dotenv for environment management

### DevOps & Tools
- GitHub Actions (CI)
- Vercel (Deployment)
- Postman (API testing)
- Cloudinary (Image storage)

---

## 📁 Project Structure

```
orient-craft/
├── client/               # Frontend React app (User side)
├── admin/                # Admin panel React app
├── server/               # Backend Express app
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middlewares/
├── .github/workflows/    # GitHub Actions CI
├── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/orient-craft.git
cd orient-craft
```

### 2. Install dependencies

```bash
# Frontend (User)
cd client
npm install

# Admin Panel
cd ../admin
npm install

# Backend
cd ../server
npm install
```

### 3. Create `.env` file in `/server`

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 4. Run locally

```bash
# Backend
cd backend
npm run server

# User Frontend
cd ../frontend
npm run dev

# Admin Panel
cd ../admin
npm run dev
```

---

## 🖼️ Screenshots

<img width="1920" height="856" alt="image" src="https://github.com/user-attachments/assets/67a9da08-dd47-46b4-b91d-3a17662f919c" />
<img width="1872" height="782" alt="image" src="https://github.com/user-attachments/assets/b2747037-515c-4b6c-a93b-eabe03392772" />


---

## 📌 Acknowledgements

- Inspired by traditional Indian artistry
- Built to empower handcrafted sellers with a digital storefront

---

## 📝 License

This project was developed for commercial use and is not licensed for redistribution or reuse without explicit permission.
