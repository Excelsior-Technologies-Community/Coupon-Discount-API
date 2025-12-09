A full-stack e-commerce platform built with Next.js/React, Node.js/Express, MongoDB, and JWT authentication. Features modern UI, real-time cart, coupon system, and review functionality.

## Backend ENV

```init
PORT=8000
MONGODB_URI=mongodb+srv://admin1:admin1234@cluster0.stp7bwb.mongodb.net/coupon_discount?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
DB_NAME=coupon_discount
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
JWT_EXPIRE=7d
```

✨ 🚀 Live Features
✅ Authentication
 User Registration/Login - JWT tokens, bcrypt hashing

 Protected Routes - Token-based authorization

 Auto-redirect on login/logout

✅ Products
 Product Catalog - Images, prices, descriptions

 Product Details - Ratings, reviews, zoom images

 Auto-increment IDs - Custom numeric IDs (1, 2, 3...)

 Stock Status - In Stock/Out of Stock

✅ Shopping Cart (Real-time)
 Add/Remove Items - Quantity controls

 Live Cart Counter - Navbar badge updates instantly

 Update Quantities - +/- buttons

 Clear Cart - Complete cart reset

 Cart Summary - Totals, populated products

✅ Reviews & Ratings
 Star Ratings (1-5) - Visual stars

 Add/Edit Reviews - Auth protected

 Average Rating - Product-level calculations

 Prevent Duplicates - One review per user per product

✅ Coupon System
 Create Coupons - Admin (code, %, limits)

 Validate Coupons - Min amount, expiry, usage limits

 Live Discounts - Real-time calculation

 Usage Tracking - usedCount increments

✅ Checkout Flow
 Shipping Address - Full form validation

 Payment Methods - Card/COD

 Order Summary - Items + discounts

 Coupon Application - Validate + apply

✅ UI/UX
 Modern Glassmorphism - Gradients, blur effects

 Responsive Design - Mobile-first

 Loading States - Spinners, skeletons

 Toast Notifications - Success/error feedback

 Animations - Hover, transitions, micro-interactions

🛠️ Tech Stack
text
Frontend: React 18 + Tailwind CSS + Axios + React Router + react-hot-toast
Backend: Node.js + Express + Mongoose + MongoDB Atlas + JWT + bcrypt
Database: MongoDB (with custom numeric IDs via counters)
Auth: JWT Bearer tokens
File Upload: Multer (images)
Deployment: Ready for Vercel/Netlify + Railway/Render
📁 Project Structure
text
coupon_discount/
├── frontend/           # React App
│   ├── src/Pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   └── Checkout.jsx
│   └── src/Components/Navbar.jsx
├── backend/
│   ├── src/models/
│   │   ├── User/userModel.js (Auth)
│   │   ├── Product/productModel.js
│   │   ├── Cart/cartModel.js
│   │   ├── Review/reviewModel.js
│   │   └── Coupon/couponModel.js
│   ├── src/controllers/
│   └── src/routes/
└── README.md
🚀 Quick Start
1. Backend Setup
bash
cd backend
npm install
cp .env.example .env
# Update MONGODB_URI, JWT_SECRET
npm run dev
2. Frontend Setup
bash
cd frontend
npm install
npm run dev
3. Test Flow
text
1. Register/Login → http://localhost:5173
2. Browse Products → Add to Cart
3. Cart Page → Navbar shows live count 🛒(2)
4. Checkout → Apply Coupon SAVE20 → Place Order
🧪 API Endpoints
Method	Endpoint	Description	Auth
POST	/api/auth/register	Create user	No
POST	/api/auth/login	JWT login	No
GET	/api/Product	All products	No
GET	/api/Product/:id	Product details	No
POST	/api/Cart/	Add to cart	Yes
GET	/api/Cart/	Get cart	Yes
DELETE	/api/Cart/clear	Clear cart	Yes
POST	/api/:id/Review/	Add review	Yes
GET	/api/:id/Review/	Get reviews	No
POST	/api/Coupon/Validate	Apply coupon	No
🎨 Screenshots
text
[Login Screen]          [Product Details]       [Cart with Live Count]
   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
   │  Welcome    │        │  Fruit $110 │        │  2 Items    │
   │  Back       │        │  ⭐⭐⭐⭐⭐ │        │  $220 Total  │
   └─────────────┘        └─────────────┘        └─────────────┘

[Checkout + Coupon]     [Navbar Live Cart Badge]
   ┌─────────────┐        🛒(3)
   │  SAVE20     │
   │  -$44 (20%) │
   └─────────────┘
🔧 Key Innovations
Custom Numeric IDs - No more ObjectIds (1, 2, 3...)

Live Cart Sync - Navbar updates instantly across pages

Atomic Counters - Mongoose pre-save hooks

Smart Coupons - Min amount, expiry, usage limits

Review System - Duplicate prevention, averages

📈 Production Ready
text
✅ JWT Auth (Secure)
✅ Error Handling (Toasts)
✅ Loading States (Spinners)
✅ Responsive (Mobile-First)
✅ Image Uploads (Multer)
✅ Rate Limiting Ready
✅ CORS Configured
✅ Environment Variables
✅ MongoDB Atlas Compatible
🤝 Contributing
Fork repository

Create feature branch (git checkout -b feature/cool-feature)

Commit changes (git commit -m 'Add cool feature')

Push (git push origin feature/cool-feature)

Open Pull Request

screenshots-

Register - 
![register](./screenshots/register.png)

Login - 
![Login](./screenshots/login.png)

products - 
![products](./screenshots/products.png)

product Details - 
![product Details](./screenshots/product_details.png)

add to cart - 
![Add to Cart](./screenshots/add_to_cart.png)

cart - 
![Cart](./screenshots/cart.png)

checkout - 
![Checout](./screenshots/checkout.png)

coupon Applied - 
![Coupon Applied](./screenshots/successful%20Coupen%20and%20discount.png)


Order placed - 
![Order Placed](./screenshots/order%20placed.png)

