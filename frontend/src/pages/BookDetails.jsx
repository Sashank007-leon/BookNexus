import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const BookDetails = () => {
  const { bookId } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState(null); // Add state for errors

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/books/${bookId}`);
        setBook(res.data);
      } catch (err) {
        console.error('Failed to fetch book details:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/reviews/book/${bookId}`);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setReviewsError('Failed to load reviews. Please try again later.');
      }
    };

    fetchBookDetails();
    fetchReviews();
  }, [bookId]);

  const handleIncrease = () => {
    if (book && quantity < book.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please log in to add items to cart.");
      navigate("/login", {
        state: { from: location },
      });
      return;
    }

    if (user.isAdmin) {
      toast.error("Admins cannot add items to the cart.");
      navigate("/admin/dashboard");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(book);
    }
    toast.success(`${quantity} "${book.title}" added to cart!`);
  };

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );

  // Separate the logged-in user's review and other reviews
  const userReview = reviews.find(r => user && r.user._id === user._id);
  const otherReviews = reviews.filter(r => !user || r.user._id !== user._id);

  // Sort reviews to show the logged-in user's review at the top
  const sortedReviews = [userReview, ...otherReviews].filter(Boolean);

  if (loading) return <p className="text-center text-lg">Loading book details...</p>;
  if (!book) return <p className="text-center text-red-500">Book not found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Book Image */}
        <div className="flex justify-center">
          <img
            src={`${API_URL.replace("/api", "")}/uploads/${book.image}`}
            alt={book.title}
            className="w-72 h-[28rem] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Book Info */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">{book.title}</h2>
          <p className="text-xl text-gray-700">by <span className="font-semibold">{book.author}</span></p>

          <p className="text-gray-600"><span className="font-semibold">Category:</span> {book.category || "Uncategorized"}</p>
          <p className="text-gray-600">
            <span className="font-semibold">Price:</span>{" "}
            <span className="text-green-600 font-bold text-xl">Rs.{book.price}</span>
          </p>

          <p className="text-sm text-gray-500 leading-relaxed">{book.description}</p>

          <p className="mt-2 text-sm font-medium">
            <span className={book.stock > 0 ? "text-green-600" : "text-red-500"}>
              {book.stock > 0 ? `${book.stock} in stock` : "Out of Stock"}
            </span>
          </p>

          {/* Quantity Selector */}
          {book.stock > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrease}
                  disabled={quantity === 1}
                  className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  −
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  disabled={quantity === book.stock}
                  className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className="mt-6 w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition duration-200 ease-in-out disabled:opacity-60"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Customer Reviews</h3>

        {reviewsError && <p className="text-red-500">{reviewsError}</p>} {/* Display error message if there's an issue fetching reviews */}

        {reviews.length === 0 && !reviewsError && <p className="text-gray-500">No reviews yet.</p>}

        {sortedReviews.map((review) => (
          <div key={review._id} className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold">{review.user.name}</h4>
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookDetails;
