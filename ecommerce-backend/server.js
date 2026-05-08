const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

// ⚠️ Stripe webhook needs raw body - must be registered BEFORE express.json()
app.post("/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/paymentController").stripeWebhook
)

// Middleware (order matters)
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth",           require("./routes/authRoutes"))
app.use("/api/products",       require("./routes/productRoutes"))

const { orderRouter, promoRouter } = require("./routes/orderRoutes")
app.use("/api/orders",         orderRouter)
app.use("/api/promo",          promoRouter)

app.use("/api/users",          require("./routes/userRoutes"))
app.use("/api/categories",     require("./routes/categoryRoutes"))
app.use("/api/seller",         require("./routes/sellerRoutes"))
app.use("/api/admin",          require("./routes/adminRoutes"))
app.use("/api/payments",       require("./routes/paymentRoutes"))
app.use("/api/marketing",      require("./routes/marketingRoutes"))
app.use("/api/notifications",  require("./routes/notificationRoutes"))

// Global error handler
app.use(require("./middleware/errorMiddleware"))

// Connect DB + Start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected")
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    )
  })
  .catch(err => {
    console.error("❌ DB connection failed:", err.message)
    process.exit(1)
  })
