import express from "express";
import { loginUser, signupUser } from "../controllers/userController.mjs";



const router = express.Router();

router.route('/signup').post(signupUser);
router.route('/login').post(loginUser);

export default router;