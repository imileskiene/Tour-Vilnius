import express from "express";
import {
  getAllCategories,
  getCategoryById,
  postCategory,
} from "../controllers/categoryController.mjs";
import {isAdmin } from "../middlewares/authorizationMiddleware.mjs";

const router = express.Router();

router.route("/").get(getAllCategories).post(isAdmin, postCategory);
router.route('/:categoryid').get(getCategoryById);

export default router;
