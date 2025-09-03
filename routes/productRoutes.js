import { Router } from "express";

import { createProduct, updateProduct, findProduct, findAllProducts, deleteProduct } from "../controllers/productController.js";
import authorization from "../middleware/authentication.js";
import fileUpload from "../middleware/fileUpload.js";


const router = Router();

router.get("/", findAllProducts);
router.get("/:id", findProduct);
router.post("/", authorization, fileUpload, createProduct);
router.put("/:id", authorization, fileUpload, updateProduct);
router.delete("/:id", authorization, deleteProduct);

export default router;
