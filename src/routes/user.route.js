import { Router } from "express";
import { registerUser, loginUser, forgetPassword, resetPassword, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
const router = Router();

// router.route("/register").post(
//     upload.single("avatar"),
//     registerUser
// )
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser)
router.route("/forget").post(forgetPassword);
router.route("/reset").post(resetPassword)
router.route("/refresh-token").post(refreshAccessToken);

export default router ;