import { Router } from "express";

import * as product from "../controllers/productController.js";
import authorization from "../middleware/authentication.js";
import fileUpload from "../middleware/fileUpload.js";


const router = Router();

router.get("/:id", product.findProduct);
router.get("/category/:category", product.findCategoryProducts);
router.get("/", product.findAllProducts);
router.post("/", authorization, fileUpload, product.createProduct);
router.put("/:id", authorization, fileUpload, product.updateProduct);
router.delete("/:id", authorization, product.deleteProduct);

export default router;
