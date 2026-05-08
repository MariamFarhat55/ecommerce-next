const Product = require("../models/Product")
const Order   = require("../models/Order")

// @GET /api/seller/products
exports.getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).populate("category", "name")
    res.json({ products })
  } catch (err) { next(err) }
}

// @POST /api/seller/products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id })
    res.status(201).json({ product })
  } catch (err) { next(err) }
}

// @PATCH /api/seller/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id })
    if (!product) return res.status(404).json({ message: "Product not found" })
    Object.assign(product, req.body)
    await product.save()
    res.json({ product })
  } catch (err) { next(err) }
}

// @DELETE /api/seller/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id })
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json({ message: "Product deleted" })
  } catch (err) { next(err) }
}

// @GET /api/seller/orders
exports.getSellerOrders = async (req, res, next) => {
  try {
    // Orders that contain products from this seller
    const products = await Product.find({ seller: req.user._id }).select("_id")
    const productIds = products.map(p => p._id)
    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) { next(err) }
}

// @PATCH /api/seller/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json({ order })
  } catch (err) { next(err) }
}

// @GET /api/seller/stats
exports.getSellerStats = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).select("_id")
    const productIds = products.map(p => p._id)
    const orders = await Order.find({ "items.product": { $in: productIds } })

    const totalEarnings  = orders.filter(o => o.isPaid).reduce((s, o) => s + o.total, 0)
    const pendingOrders  = orders.filter(o => o.status === "pending").length

    res.json({
      totalProducts: products.length,
      totalOrders:   orders.length,
      totalEarnings,
      pendingOrders,
    })
  } catch (err) { next(err) }
}

// @GET /api/seller/earnings
exports.getSellerEarnings = async (req, res, next) => {
  try {
    const products   = await Product.find({ seller: req.user._id }).select("_id")
    const productIds = products.map(p => p._id)
    const orders     = await Order.find({ "items.product": { $in: productIds }, isPaid: true })

    const total     = orders.reduce((s, o) => s + o.total, 0)
    const pending   = orders.filter(o => o.status !== "delivered").reduce((s, o) => s + o.total, 0)
    const available = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0)

    res.json({ total, pending, available, payouts: [] })
  } catch (err) { next(err) }
}

// @POST /api/seller/payout
exports.requestPayout = async (req, res, next) => {
  try {
    // placeholder — في المستقبل هنا بتتعمل payout logic
    res.json({ message: "Payout request received" })
  } catch (err) { next(err) }
}