import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";

export const addReview = async (req, res) => {
  const { bookId, orderId, rating, comment } = req.body;
  const userId = req.user._id;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: "Completed",
      paymentStatus: "Paid",
      "items.book": bookId,
    });

    if (!order) {
      return res.status(403).json({ message: "Not eligible to review this book." });
    }

    const existingReview = await Review.findOne({ user: userId, book: bookId, order: orderId });
    if (existingReview) {
      return res.status(400).json({ message: "You've already reviewed this book for this order." });
    }

    const review = await Review.create({
      user: userId,
      book: bookId,
      order: orderId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review" });
  }
};

export const getBookReviews = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    // Fetch reviews and populate the user field to get the user's details
    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name'); // This will populate only the 'name' field from the 'User' model

    // Find the user's review if logged in
    let userReview = null;
    if (req.user) {
      userReview = reviews.find(review => review.user._id.toString() === req.user._id.toString());
    }

    // If the user has a review, remove it from the reviews array
    if (userReview) {
      reviews.splice(reviews.indexOf(userReview), 1);
    }

    // Add the user's review at the top of the reviews array
    if (userReview) {
      reviews.unshift(userReview);
    }

    res.json({ reviews, userReview });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user reviews" });
  }
};

export const getMyReviews = async (req, res) => {
  const reviews = await Review.find({ user: req.user._id }).populate("book");
  res.status(200).json(reviews);
};
