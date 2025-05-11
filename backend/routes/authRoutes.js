import express from "express";
import { body } from "express-validator";
import { loginUser, registerUser } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 8 characters"),
    validateRequest,
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  loginUser
);

export default router;
