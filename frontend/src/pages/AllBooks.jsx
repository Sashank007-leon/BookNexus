import { useEffect, useState } from "react";
import axios from "axios";
import { categories } from "../constants/categories";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate(); // Hook to navigate between pages

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/books`);
        const allBooks = Array.isArray(res.data) ? res.data : [];
        setBooks(allBooks);
        setFilteredBooks(allBooks);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = [...books];

    // Filter by title
    if (searchInput) {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((book) => book.category === selectedCategory);
    }

    // Filter by price range
    if (minPrice !== "") {
      result = result.filter((book) => Number(book.price) >= Number(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter((book) => Number(book.price) <= Number(maxPrice));
    }

    setFilteredBooks(result);
  }, [searchInput, selectedCategory, minPrice, maxPrice, books]);

  const handleViewDetails = (bookId) => {
    // Navigate to the BookDetails page with the bookId as a parameter
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">Browse Our Books</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {/* Search */}
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title..."
          className="px-4 py-2 border border-gray-300 rounded-lg w-60"
        />

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-48"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Min Price */}
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
          className="px-4 py-2 border border-gray-300 rounded-lg w-32"
        />

        {/* Max Price */}
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
          className="px-4 py-2 border border-gray-300 rounded-lg w-32"
        />

        {/* Reset Filters */}
        <button
          onClick={() => {
            setSearchInput("");
            setSelectedCategory("");
            setMinPrice("");
            setMaxPrice("");
          }}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
        >
          Reset Filters
        </button>
      </div>

      {/* Book List */}
      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <p className="text-center text-red-500 text-lg">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Book Image */}
              <img
                src={`${API_URL.replace("/api", "")}/uploads/${book.image}`}
                alt={book.title}
                className="w-full h-56 object-cover"
              />

              {/* Book Info */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">by {book.author}</p>
                  <span className="text-xs inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {book.category || "Uncategorized"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold text-green-600">
                    Rs.{book.price}
                  </p>
                  <span
                    className={`text-sm font-medium ${
                      book.stock > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {book.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <button
                  onClick={() => handleViewDetails(book._id)}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition duration-200 ease-in-out"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
