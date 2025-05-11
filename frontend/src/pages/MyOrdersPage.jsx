import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import StarRatings from "react-star-ratings";

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrdersAndReviews = async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          axios.get(`${API_URL}/order/my-orders`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get(`${API_URL}/reviews/my-reviews`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        setOrders(ordersRes.data);
        setUserReviews(reviewsRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch orders or reviews.");
      }
    };

    fetchOrdersAndReviews();
  }, [user, API_URL]);

  const hasReviewed = (bookId) => {
    return userReviews.some((review) => review.bookId === bookId);
  };

  const openReviewModal = (book, orderId) => {
    setSelectedBook(book);
    setSelectedOrderId(orderId);
    setRating(0);
    setComment("");
    setModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (rating === 0 || comment.trim() === "") {
      toast.warn("Please give a rating and write a comment.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/reviews`,
        {
          bookId: selectedBook._id,
          orderId: selectedOrderId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setUserReviews((prev) => [...prev, res.data]);
      toast.success("Review submitted!");
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (!orders.length) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold">You have no orders yet</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg shadow-md p-5 bg-white"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">
                Order #{order._id.slice(-6)}
              </h2>
              <p className="text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              {order.items.map(({ book, quantity, price }) => (
                <div
                  key={book._id}
                  className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700"
                >
                  <span>
                    {book.title} by {book.author}
                  </span>
                  <span>
                    {quantity} x Rs.{price.toFixed(2)} = Rs.
                    {(price * quantity).toFixed(2)}
                  </span>

                  {order.status === "Completed" &&
                    order.paymentStatus === "Paid" &&
                    !hasReviewed(book._id) && (
                      <button
                        className="text-blue-600 text-xs underline mt-1 sm:mt-0"
                        onClick={() => openReviewModal(book, order._id)}
                      >
                        Leave a Review
                      </button>
                    )}
                </div>
              ))}
            </div>

            <div className="mt-4 font-bold text-right text-green-600">
              Total: Rs.{order.totalAmount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 Optional Light Backdrop */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm" />
        </div>
      )}

      {/* ⭐ Review Modal */}
      {modalOpen && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-md">
          <div className="bg-white p-6 rounded-xl border shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Review: {selectedBook?.title}
            </h2>

            <StarRatings
              rating={rating}
              starRatedColor="#facc15"
              starHoverColor="#facc15"
              changeRating={setRating}
              numberOfStars={5}
              name="rating"
              starDimension="30px"
              starSpacing="4px"
            />

            <textarea
              className="w-full mt-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSubmitReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
