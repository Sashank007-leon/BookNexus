import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const FeaturedBooks = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_URL}/books/with-ratings`);
        const featured = res.data.filter((book) => book.averageRating >= 3);
        setFeaturedBooks(featured);
      } catch (err) {
        console.error("Failed to fetch featured books:", err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Featured Books
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <img
                src={`${API_URL.replace("/api", "")}/uploads/${book.image}`}
                alt={book.title}
                className="h-60 w-full object-cover rounded-t-2xl"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {book.title}
                </h3>

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    ⭐ {book.averageRating.toFixed(1)} / 5
                  </span>
                </div>

                <Link
                  to={`/books/${book._id}`}
                  className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
