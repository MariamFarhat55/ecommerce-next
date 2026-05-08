/**
 * 🌱 SEED SCRIPT — ecommerce-next
 * ضعي الملف ده جوا: ecommerce-backend/seed.js
 * شغليه بـ: node seed.js
 *
 * هيضيف:
 *  ✅ Admin user (موجود بالفعل — مش هيتكرر)
 *  ✅ Seller user
 *  ✅ Customer user
 *  ✅ 6 Categories
 *  ✅ 20 Products
 *  ✅ 5 Promo Codes
 */

const mongoose = require("mongoose")
const bcrypt   = require("bcryptjs")
require("dotenv").config()

// ── Models ──────────────────────────────────────────
const User      = require("./models/User")
const Category  = require("./models/Category")
const Product   = require("./models/Product")
const PromoCode = require("./models/PromoCode")

// ── Connect ─────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log("✅ MongoDB connected"); run() })
  .catch(err => { console.error("❌", err.message); process.exit(1) })

// ── Main ─────────────────────────────────────────────
async function run() {
  try {
    console.log("\n🌱 Starting seed...\n")

    // ── 1. USERS ──────────────────────────────────────
    // Admin (لو موجود بالفعل مش هيتعمل تاني)
    let admin = await User.findOne({ email: "admin@luxe.com" })
    if (!admin) {
      admin = await User.create({
        name: "Admin", email: "admin@luxe.com",
        phone: "01000000000", password: "123456",
        role: "admin", active: true, isVerified: true,
      })
      console.log("👤 Admin created")
    } else {
      console.log("👤 Admin already exists — skipping")
    }

    // Seller
    let seller = await User.findOne({ email: "seller@luxe.com" })
    if (!seller) {
      seller = await User.create({
        name: "Mariam Store", email: "seller@luxe.com",
        phone: "01100000000", password: "123456",
        role: "seller", active: true, isVerified: true,
      })
      console.log("🏪 Seller created")
    } else {
      console.log("🏪 Seller already exists — skipping")
    }

    // Customer
    let customer = await User.findOne({ email: "customer@luxe.com" })
    if (!customer) {
      customer = await User.create({
        name: "Test Customer", email: "customer@luxe.com",
        phone: "01200000000", password: "123456",
        role: "customer", active: true, isVerified: true,
      })
      console.log("🛍️  Customer created")
    } else {
      console.log("🛍️  Customer already exists — skipping")
    }

    // ── 2. CATEGORIES ──────────────────────────────────
    const categoryData = [
      { name: "Women",       image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
      { name: "Men",         image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
      { name: "Shoes",       image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
      { name: "Bags",        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
      { name: "Accessories", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80" },
      { name: "Watches",     image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
    ]

    const cats = {}
    for (const c of categoryData) {
      let cat = await Category.findOne({ name: c.name })
      if (!cat) {
        cat = await Category.create(c)
        console.log(`📁 Category created: ${c.name}`)
      } else {
        console.log(`📁 Category exists: ${c.name} — skipping`)
      }
      cats[c.name] = cat._id
    }

    // ── 3. PRODUCTS ────────────────────────────────────
    const productCount = await Product.countDocuments()
    if (productCount > 0) {
      console.log(`\n📦 ${productCount} products already exist — skipping products\n`)
    } else {
      const products = [
        // Women
        {
          name: "Floral Midi Dress", category: cats["Women"], price: 49.99, stock: 30,
          description: "Elegant floral print midi dress, perfect for any occasion. Lightweight fabric with a flattering silhouette.",
          images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80"],
        },
        {
          name: "Classic White Blouse", category: cats["Women"], price: 29.99, stock: 50,
          description: "Timeless white blouse with button-down front. Versatile piece that pairs with anything.",
          images: ["https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&q=80"],
        },
        {
          name: "High-Waist Jeans", category: cats["Women"], price: 59.99, stock: 40,
          description: "Modern high-waist slim fit jeans. Comfortable stretch denim that holds its shape.",
          images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80"],
        },
        {
          name: "Knit Cardigan", category: cats["Women"], price: 44.99, stock: 25,
          description: "Cozy oversized knit cardigan in neutral tones. Perfect for layering in any season.",
          images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80"],
        },
        // Men
        {
          name: "Classic Oxford Shirt", category: cats["Men"], price: 39.99, stock: 45,
          description: "Crisp Oxford button-down shirt. Made from premium cotton for all-day comfort.",
          images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80"],
        },
        {
          name: "Slim Chino Pants", category: cats["Men"], price: 54.99, stock: 35,
          description: "Smart slim-fit chino pants with a modern cut. Versatile for casual or semi-formal wear.",
          images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80"],
        },
        {
          name: "Denim Jacket", category: cats["Men"], price: 79.99, stock: 20,
          description: "Classic denim jacket with a modern slim cut. A wardrobe essential for every season.",
          images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80"],
        },
        {
          name: "Merino Wool Sweater", category: cats["Men"], price: 89.99, stock: 15,
          description: "Premium merino wool crew-neck sweater. Incredibly soft and naturally temperature-regulating.",
          images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80"],
        },
        // Shoes
        {
          name: "Classic White Sneakers", category: cats["Shoes"], price: 89.99, stock: 60,
          description: "Clean minimal white leather sneakers. The ultimate everyday shoe that goes with everything.",
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"],
        },
        {
          name: "Chelsea Boots", category: cats["Shoes"], price: 129.99, stock: 25,
          description: "Sleek leather Chelsea boots with elastic side panels. Effortlessly stylish and easy to wear.",
          images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80"],
        },
        {
          name: "Running Sneakers", category: cats["Shoes"], price: 99.99, stock: 40,
          description: "High-performance running shoes with responsive cushioning and breathable mesh upper.",
          images: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80"],
        },
        {
          name: "Strappy Sandals", category: cats["Shoes"], price: 59.99, stock: 30,
          description: "Elegant strappy flat sandals in genuine leather. Perfect for warm weather styling.",
          images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80"],
        },
        // Bags
        {
          name: "Leather Tote Bag", category: cats["Bags"], price: 149.99, stock: 20,
          description: "Spacious genuine leather tote bag with interior pockets. Perfect for work or weekend.",
          images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80"],
        },
        {
          name: "Mini Crossbody Bag", category: cats["Bags"], price: 79.99, stock: 35,
          description: "Compact crossbody bag with adjustable strap. Fits all your essentials with a chic look.",
          images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80"],
        },
        {
          name: "Classic Backpack", category: cats["Bags"], price: 119.99, stock: 25,
          description: "Versatile leather backpack with laptop compartment. Style meets functionality.",
          images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"],
        },
        // Accessories
        {
          name: "Silk Scarf", category: cats["Accessories"], price: 34.99, stock: 50,
          description: "Luxurious 100% silk scarf with a vibrant print. Can be worn multiple ways.",
          images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80"],
        },
        {
          name: "Gold Hoop Earrings", category: cats["Accessories"], price: 24.99, stock: 80,
          description: "Classic gold-plated hoop earrings. Timeless design that complements any outfit.",
          images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80"],
        },
        {
          name: "Leather Belt", category: cats["Accessories"], price: 39.99, stock: 45,
          description: "Premium genuine leather belt with a polished buckle. The finishing touch to any look.",
          images: ["https://images.unsplash.com/photo-1624222247344-550fb60e5f0d?w=500&q=80"],
        },
        // Watches
        {
          name: "Minimalist Watch", category: cats["Watches"], price: 199.99, stock: 15,
          description: "Clean minimalist watch with a genuine leather strap. Swiss movement for reliable timekeeping.",
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
        },
        {
          name: "Sport Chronograph", category: cats["Watches"], price: 249.99, stock: 10,
          description: "Bold sport chronograph with stainless steel case. Water-resistant with multiple functions.",
          images: ["https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80"],
        },
      ]

       const existingSeller = await User.findOne({ role: "seller" })
      for (const p of products) {
        await Product.create({
          ...p,
          seller: existingSeller._id,
          isActive: true,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1)
        })
      }
      console.log(`\n📦 ${products.length} products created ✅`)
    }

    // ── 4. PROMO CODES ─────────────────────────────────
    const promos = [
      { code: "WELCOME10", discount: 10, type: "percentage", isActive: true },
      { code: "SAVE20",    discount: 20, type: "percentage", isActive: true },
      { code: "FLAT15",    discount: 15, type: "fixed",      isActive: true },
      { code: "VIP30",     discount: 30, type: "percentage", isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days
      { code: "SUMMER25",  discount: 25, type: "percentage", isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
    ]

    let promosAdded = 0
    for (const p of promos) {
      const exists = await PromoCode.findOne({ code: p.code })
      if (!exists) { await PromoCode.create(p); promosAdded++ }
    }
    console.log(`\n🎟️  ${promosAdded} promo codes created ✅`)

    // ── DONE ───────────────────────────────────────────
    console.log("\n" + "=".repeat(50))
    console.log("✅ SEED COMPLETE!")
    console.log("=".repeat(50))
    console.log("\n📋 Accounts:")
    console.log("  Admin    → admin@luxe.com    / 123456")
    console.log("  Seller   → seller@luxe.com   / 123456")
    console.log("  Customer → customer@luxe.com / 123456")
    console.log("\n🎟️  Promo Codes:")
    console.log("  WELCOME10 → 10% off")
    console.log("  SAVE20    → 20% off")
    console.log("  FLAT15    → $15 off")
    console.log("  VIP30     → 30% off (7 days)")
    console.log("  SUMMER25  → 25% off (30 days)")
    console.log("")

    process.exit(0)
  } catch (err) {
    console.error("❌ Seed error:", err.message)
    process.exit(1)
  }
}
