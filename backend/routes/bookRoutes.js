import express from "express";
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getBooksWithAverageRating,
} from "../controllers/bookController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getBooks);
router.get("/with-ratings", getBooksWithAverageRating);
router.get("/:id", getBookById);

// Admin-only routes
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
    validateRequest,
  ],
  addBook
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  [
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
    validateRequest,
  ],
  updateBook
);

router.delete("/:id", protect, admin, deleteBook);

export default router;
