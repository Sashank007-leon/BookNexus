import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CategoryBooksPage = () => {
  const { categoryName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/books?category=${categoryName}`
        );
        setBooks(res.data);
      } catch (error) {
        console.error("Error fetching books by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksByCategory();
  }, [categoryName]);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Books in "{categoryName}" Category
      </h2>
      {books.length === 0 ? (
        <p className="text-center text-gray-500">
          No books found in this category.
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={`${API_URL.replace("/api", "")}/uploads/${book.image}`}
                alt={book.title}
                className="h-64 w-full object-cover"
              />
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
                <Link
                  to={`/books/${book._id}`}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition duration-200 ease-in-out"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBooksPage;
