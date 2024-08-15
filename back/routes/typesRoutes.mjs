import express from "express";
import { getAllTypes } from "../controllers/typeController.mjs";

const router = express.Router();

router.route("/").get(getAllTypes)

export default router;
