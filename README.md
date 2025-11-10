# KickVibe - Modern Full-Stack E-Commerce Platform

 <!-- Replace with a screenshot of your app's homepage -->

KickVibe is a feature-rich, full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) and designed with a modern, beautiful, and highly interactive user interface. It serves as a complete blueprint for a production-grade online shoe store, featuring everything from product browsing to a secure payment gateway and a comprehensive admin dashboard.

---

## ✨ Features

KickVibe is packed with features designed to provide a seamless and engaging experience for both customers and administrators.

### 👤 Customer-Facing Features
- **Modern & Responsive UI:** A stunning, mobile-first design built with Tailwind CSS, featuring beautiful animations and a polished user experience.
- **Dynamic Theming:** Switch between light and dark modes with a single click.
- **Full Product Catalog:** Browse, search, and filter products by category and brand.
- **Product Details Page:** View multiple product images with an interactive zoom-on-hover feature, select sizes, and read customer reviews.
- **Comprehensive Authentication:** Secure JWT-based authentication with cookie storage, including standard email/password registration and Google OAuth 2.0.
- **Shopping Cart:** Add, update, and remove items with smooth animations and real-time updates.
- **Wishlist:** Save favorite products for later.
- **Real Payment Gateway:** Secure and seamless checkout process powered by **Stripe**.
- **Customer Account Dashboard:** Users can view their order history, manage their profile details, and update their password.
- **Product Reviews:** Authenticated users can submit reviews (with star ratings) for products they've purchased.

### 🔒 Admin Dashboard Features
- **Protected Admin Section:** A secure, role-based dashboard accessible only to administrators.
- **Dashboard Overview:** At-a-glance statistics for total revenue, sales, and customers.
- **Full Product Management (CRUD):**
    - **Create:** Add new products with multiple image uploads via a form modal.
    - **Read:** View all products in a paginated table.
    - **Update:** Edit product details.
    - **Delete:** Remove products from the store.
- **Order Management:** View all customer orders.
- **User Management:** View all registered users and their roles.

---

## 🛠️ Tech Stack

This project utilizes a modern, robust, and scalable technology stack.

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web framework for building the RESTful API.
- **MongoDB:** NoSQL database for storing product, user, and order data.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
- **Stripe:** For handling secure payment processing.
- **JSON Web Tokens (JWT):** For secure, stateless authentication.
- **Passport.js:** For seamless Google OAuth 2.0 integration.
- **Cloudinary:** For cloud-based image hosting and management.
- **Multer:** For handling multipart/form-data (file uploads).
- **CORS, Cookie-Parser, Bcrypt, Dotenv**

### Frontend
- **React:** A JavaScript library for building user interfaces.
- **React Router:** For declarative routing in the single-page application.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Stripe.js & React Stripe.js:** For secure, PCI-compliant payment forms.
- **Framer Motion:** For beautiful and performant animations.
- **Axios:** For making HTTP requests to the backend API.
- **React Hot Toast:** For clean and modern notifications.
- **Lucide React:** A beautiful and consistent icon library.
- **Vite:** Next-generation frontend tooling for a blazing-fast development experience.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn
- MongoDB installed and running locally, or a connection string from MongoDB Atlas.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/kickvibe.git
    cd kickvibe
    ```

2.  **Setup Backend:**
    ```sh
    cd Backend
    npm install
    ```
    - Create a `.env` file in the `Backend` directory and add the following variables:
      ```env
      PORT=8000
      MONGODB_URI=your_mongodb_connection_string
      CORS_ORIGIN=http://localhost:5173

      ACCESS_TOKEN_SECRET=your_super_secret_access_token
      ACCESS_TOKEN_EXPIRY=1d
      REFRESH_TOKEN_SECRET=your_super_secret_refresh_token
      REFRESH_TOKEN_EXPIRY=10d

      CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
      CLOUDINARY_API_KEY=your_cloudinary_api_key
      CLOUDINARY_API_SECRET=your_cloudinary_api_secret
      
      GOOGLE_CLIENT_ID=your_google_client_id
      GOOGLE_CLIENT_SECRET=your_google_client_secret
      
      STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
      STRIPE_SECRET_KEY=your_stripe_secret_key
      ```
    - Run the backend server:
      ```sh
      npm run dev
      ```

3.  **Setup Frontend:**
    - Open a new terminal window.
    - Navigate to the `Frontend` directory:
      ```sh
      cd Frontend
      npm install
      ```
    - Create a `.env` file in the `Frontend` directory and add the following variables:
      ```env
      VITE_BACKEND_URL=http://localhost:8000
      VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
      ```
    - Run the frontend development server:
      ```sh
      npm run dev
      ```
    - Open [http://localhost:5173](http://localhost:5173) in your browser.

4.  **(Optional) Seed the Database:**
    - To populate the database with initial product data, you first need to register at least one user in the application.
    - Then, run the seeder script from the `Backend` directory:
      ```sh
      npm run seed
      ```
    - To destroy the seeded data:
      ```sh
      npm run seed:destroy
      ```

5.  **(Optional) Become an Admin:**
    - After registering a user, connect to your MongoDB database.
    - Find your user in the `users` collection.
    - Edit the document and add a new field: `"role": "admin"`.
    - Log out and log back in. You can now access the admin dashboard at `/admin`.

---
