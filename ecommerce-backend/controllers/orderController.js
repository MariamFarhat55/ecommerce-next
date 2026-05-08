const Order     = require("../models/Order")
const Product   = require("../models/Product")
const PromoCode = require("../models/PromoCode")
const sendEmail = require("../utils/sendEmail")

// @POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shipping, paymentMethod, discount, total } = req.body

    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item._id)
      if (!product || product.stock < item.qty)
        return res.status(400).json({ message: `${item.name} is out of stock` })
    }

    const subtotal     = items.reduce((s, i) => s + i.price * i.qty, 0)
    const shippingCost = subtotal > 100 ? 0 : 10

    const order = await Order.create({
      user: req.user?._id ?? null,
      items: items.map(i => ({ product: i._id, name: i.name, price: i.price, qty: i.qty, image: i.images?.[0] })),
      shipping,
      paymentMethod,
      subtotal,
      shippingCost,
      discount: discount ?? 0,
      total,
    })

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } })
    }

    // Send confirmation email
    if (req.user?.email) {
      await sendEmail({
        to: req.user.email,
        subject: `Order Confirmed — #${order._id.toString().slice(-6).toUpperCase()}`,
        html: `<p>Hi ${req.user.name},</p><p>Your order has been placed successfully!</p><p>Total: $${total}</p>`,
      })
    }

    res.status(201).json({ order, message: "Order placed successfully" })
  } catch (err) { next(err) }
}

// @GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) { next(err) }
}

// @GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {

    // Prevent invalid ids
    if (!req.params.id || req.params.id === "null") {
      return res.status(400).json({
        message: "Invalid order id"
      })
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")

    // Order not found
    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    // Authorization check
    if (
      order.user &&
      order.user._id.toString() !== req.user?._id?.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized"
      })
    }

    res.json({ order })

  } catch (err) {
    console.error("❌ Error fetching order:", err)
    next(err)
  }
}

// @PATCH /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: "Order not found" })
    if (order.status !== "pending")
      return res.status(400).json({ message: "Can only cancel pending orders" })

    order.status = "cancelled"
    await order.save()

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } })
    }

    res.json({ message: "Order cancelled" })
  } catch (err) { next(err) }
}

// @POST /api/promo/apply
exports.applyPromo = async (req, res, next) => {
  try {
    const { code, total } = req.body
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true })
    if (!promo) return res.status(404).json({ message: "Invalid promo code" })
    if (promo.expiresAt && promo.expiresAt < Date.now())
      return res.status(400).json({ message: "Promo code expired" })

    const discount = promo.type === "percentage"
      ? (total * promo.discount) / 100
      : promo.discount

    promo.usedCount++
    await promo.save()

    res.json({ discount, message: `Promo applied! You saved $${discount.toFixed(2)}` })
  } catch (err) { next(err) }
}