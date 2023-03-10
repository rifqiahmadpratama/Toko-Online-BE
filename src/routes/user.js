const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const userController = require("../controllers/user");

router.get("/", userController.getAlluser);
router.post("/register-penjual", userController.registerPenjual);
router.post("/register-pembeli", userController.registerPembeli);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);
router.get("/profile", protect, userController.profile);
router.put(
  "/updateProfile",
  protect,
  upload.single("photo"),
  userController.updateProfile
);

module.exports = router;
