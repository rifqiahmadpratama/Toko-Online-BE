const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const productController = require("../controllers/product");

router.get("/", productController.getAllproduct);
router.post(
  "/create",
  protect,
  upload.single("photo"),
  productController.createProduct
);
router.put(
  "/update/:id",
  protect,
  upload.single("photo"),
  productController.updateProduct
);
router.delete("/delete/:id", protect, productController.deleteProduct);

module.exports = router;
