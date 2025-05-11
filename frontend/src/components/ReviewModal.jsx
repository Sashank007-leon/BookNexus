import { useState } from "react";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";

const ReviewModal = ({ isOpen, onClose, book, orderId, user }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/review`,
        {
          bookId: book._id,
          orderId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      toast.success("Review submitted!");
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-[90vw] max-w-lg animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Leave a Review</h2>
        <p className="text-center text-gray-500 mb-4">for <span className="font-semibold">{book.title}</span></p>
  
        <div className="flex justify-center mb-4">
          <ReactStars
            count={5}
            size={32}
            activeColor="#facc15"
            value={rating}
            onChange={setRating}
          />
        </div>
  
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
  
        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-sm rounded text-white transition ${
              rating === 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default ReviewModal;
