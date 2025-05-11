import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addReview, getBookReviews, getMyReviews, getUserReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, addReview); 
router.get("/book/:bookId", getBookReviews); 
router.get("/user", protect, getUserReviews);
router.get('/my-reviews', protect, getMyReviews);


export default router;
