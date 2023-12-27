import { Router } from "express";
import { registerUser, loginUser, forgetPassword, resetPassword } from "../controllers/user.controller.js";
const router = Router();

// router.route("/register").post(
//     upload.single("avatar"),
//     registerUser
// )
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forget").post(forgetPassword);
router.route("/reset").post(resetPassword)

export default router ;