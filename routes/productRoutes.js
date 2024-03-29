const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.get("/:id", productController.findProduct);
router.get("/", productController.findAllProducts);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
