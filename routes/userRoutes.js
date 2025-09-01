import { Router } from "express";

import { login, register } from "../controllers/userController.js";
import { validateLogin, validateRegister } from "../middleware/validation.js";


const router = Router();

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);

export default router;
