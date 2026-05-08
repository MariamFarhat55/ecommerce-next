const router = require("express").Router()
const ctrl   = require("../controllers/adminController")
const { protect, adminOnly } = require("../middleware/authMiddleware")

router.use(protect, adminOnly)

router.get("/stats",              ctrl.getStats)
router.get("/users",              ctrl.getUsers)
router.patch("/users/:id",        ctrl.updateUser)
router.get("/products",           ctrl.getProducts)
router.delete("/products/:id",    ctrl.deleteProduct)
router.delete("/users/:id",    ctrl.deleteUser)
router.post("/products", ctrl.createProduct) 
router.get("/orders",             ctrl.getOrders)
router.patch("/orders/:id/status", ctrl.updateOrderStatus)
router.get("/categories",         ctrl.getCategories)
router.post("/categories",        ctrl.createCategory)
router.delete("/categories/:id",  ctrl.deleteCategory)
router.get("/promo",              ctrl.getPromos)
router.post("/promo",             ctrl.createPromo)
router.delete("/promo/:id",       ctrl.deletePromo)

module.exports = router