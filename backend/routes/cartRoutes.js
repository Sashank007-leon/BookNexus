import express from "express";
import { body } from "express-validator";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.use(protect); // all routes are protected

router.get("/", getCart);

router.post(
  "/",
  protect,
  [
    body("bookId").notEmpty().withMessage("Book ID is required"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    validateRequest,
  ],
  addToCart
);

router.put("/:id", updateCartItem);

router.delete("/:id", removeCartItem);

router.delete("/clear", clearCart);

export default router;
