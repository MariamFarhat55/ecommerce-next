const router = require("express").Router()
const { protect } = require("../middleware/authMiddleware")
const { getProfile, updateProfile, getLoyalty } = require("../controllers/userController")

router.get("/profile",  protect, getProfile)
router.patch("/profile", protect, updateProfile)
router.get("/loyalty",  protect, getLoyalty)

module.exports = router