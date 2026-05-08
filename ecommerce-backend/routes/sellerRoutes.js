const router  = require("express").Router()
const ctrl    = require("../controllers/sellerController")
const { protect, sellerOnly } = require("../middleware/authMiddleware")

router.use(protect, sellerOnly)

router.get("/products",          ctrl.getSellerProducts)
router.post("/products",         ctrl.createProduct)
router.patch("/products/:id",    ctrl.updateProduct)
router.delete("/products/:id",   ctrl.deleteProduct)
router.get("/orders",            ctrl.getSellerOrders)
router.patch("/orders/:id/status", ctrl.updateOrderStatus)
router.get("/stats",             ctrl.getSellerStats)
router.get("/earnings",    ctrl.getSellerEarnings)
router.post("/payout",     ctrl.requestPayout)

module.exports = router