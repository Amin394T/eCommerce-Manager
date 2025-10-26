import { Router } from "express";
import * as reviewController from "../controllers/reviewController.js";
import authorization from "../middleware/authentication.js";


const router = Router();

router.get("/:product", reviewController.findProductReviews);
router.get("/merchant/:merchant", reviewController.findMerchantReviews);
router.post("/", authorization, reviewController.createReview);
router.patch("/:id", authorization, reviewController.updateReview);
router.delete("/:id", authorization, reviewController.deleteReview);

export default router;
