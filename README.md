# Shoply Store 🛍️

A full-stack e-commerce marketplace built with Next.js 16 and Node.js.

---

## Tech Stack

**Frontend:** React.js, Next.js 16 (App Router), Tailwind CSS, Zustand, NextAuth.js  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Auth:** JWT + NextAuth.js  
**Payment:** Stripe, PayPal  
**Email:** Nodemailer  

---

## Features

### Customer
- Register & login with email verification
- Browse, search & filter products by category/price
- Wishlist & shopping cart
- Multi-step checkout (Card, PayPal, COD, Wallet)
- Order tracking with status timeline
- Reviews & ratings

### Seller
- Seller dashboard with stats
- Product & inventory management (Add/Edit/Delete)
- Order management & status updates
- Earnings & payout tracking

### Admin
- User management (approve/restrict — soft delete)
- Product & category management
- Order & shipping oversight
- Promo code & discount management
- Homepage content management

---

## Project Structure
shoply-store/
├── ecommerce-frontend/     ← Next.js 16
│   ├── app/
│   │   ├── (auth)/         ← Login, Register, Forgot Password
│   │   ├── (root)/         ← Homepage, Products, Cart, Checkout
│   │   └── (dashboard)/    ← Admin & Seller dashboards
│   ├── components/
│   │   ├── layout/         ← Navbar, Footer
│   │   ├── products/       ← ProductCard, ProductFilters
│   │   ├── cart/           ← CartItem, OrderSummary
│   │   ├── checkout/       ← ShippingForm, PaymentMethod
│   │   ├── orders/         ← OrderTracking
│   │   ├── marketing/      ← Newsletter, Loyalty, Referral
│   │   └── shared/         ← LoadingSpinner, ErrorBoundary
│   ├── hooks/              ← useAuth, useCart, useWishlist
│   ├── store/              ← cartStore, wishlistStore (Zustand)
│   ├── lib/                ← axios, authOptions, utils
│   └── middleware.js       ← Route protection
│
└── ecommerce-backend/      ← Node.js + Express
├── controllers/        ← auth, product, order, user, admin, seller
├── models/             ← User, Product, Order, Category, PromoCode
├── routes/             ← All API routes
├── middleware/         ← authMiddleware, errorMiddleware
└── utils/              ← sendEmail

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account
- Gmail account (for email)

### Backend Setup

```bash
cd ecommerce-backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd ecommerce-frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
```

```bash
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/orders` | Create order | Public/Auth |
| GET | `/api/orders/my-orders` | Get my orders | Customer |
| POST | `/api/seller/products` | Add product | Seller |
| GET | `/api/admin/users` | Get all users | Admin |
| PATCH | `/api/admin/users/:id` | Update user role | Admin |

---

## User Roles

| Role | Access |
|------|--------|
| Customer | Browse, cart, checkout, orders, profile |
| Seller | + Seller dashboard, product management |
| Admin | + Full platform control |

---

## Database Models

- **User** — name, email, phone, password, role, address, loyaltyPoints, walletBalance
- **Product** — name, description, price, images, category, seller, stock, reviews, rating
- **Order** — user, items, shipping, paymentMethod, status, total, discount
- **Category** — name, image
- **PromoCode** — code, discount, type, expiresAt, usedCount

---

## Built By

Mariam Mohamed — ITI Full Stack Web Development Track