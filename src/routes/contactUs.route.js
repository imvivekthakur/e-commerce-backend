import { Router } from "express";
import { contactUs } from "../controllers/contactUs.controller.js";
const router = Router();

router.post("/contactus", contactUs);

export default router;