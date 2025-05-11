import express from "express";
import { body } from "express-validator";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  [
    body("items").isArray({ min: 1 }).withMessage("Items cannot be empty"),
    body("totalAmount")
      .isNumeric()
      .withMessage("Total amount must be a number")
      .notEmpty()
      .withMessage("Total amount is required"),
    validateRequest,
  ],
  placeOrder
);

router.get("/my-orders", protect, getUserOrders);

router.get("/", protect, admin, getAllOrders);

router.patch("/:id", protect, admin, updateOrder);

router.delete("/:id", protect, admin, deleteOrder);

export default router;
