const router = require("express").Router()
const { createOrder, getMyOrders, getOrder, cancelOrder, applyPromo } = require("../controllers/orderController")
const { protect } = require("../middleware/authMiddleware")

router.post("/",             protect, createOrder)
router.get("/my-orders",     protect, getMyOrders)
router.get("/:id",           protect, getOrder)
router.patch("/:id/cancel",  protect, cancelOrder)

// Promo
const promoRouter = require("express").Router()
promoRouter.post("/apply", applyPromo)
module.exports = { orderRouter: router, promoRouter }