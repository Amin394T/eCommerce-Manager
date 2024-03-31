const express = require("express");
const productController = require("../controllers/productController");
const authorization = require("../middleware/authentication");

const router = express.Router();

router.post("/", authorization, productController.createProduct);
router.put("/:id", authorization, productController.updateProduct);
router.get("/:id", authorization, productController.findProduct);
router.get("/", authorization, productController.findAllProducts);
router.delete("/:id", authorization, productController.deleteProduct);

module.exports = router;
