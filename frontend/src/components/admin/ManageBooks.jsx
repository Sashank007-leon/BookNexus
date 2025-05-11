import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { categories } from "../../constants/categories";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const ManageBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const imageInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: null,
  });

  const [editBookId, setEditBookId] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/books`);
      setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "price" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, author, description, price, category, stock } = formData;

    if (!title || !author || !description || !price || !category || !stock) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const token =
        user?.token || JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        toast.warning("You need to be logged in to perform this action.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", title);
      formDataToSend.append("author", author);
      formDataToSend.append("description", description);
      formDataToSend.append("price", Number(price));
      formDataToSend.append("category", category);
      formDataToSend.append("stock", Number(stock));
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editBookId) {
        await axios.put(`${API_URL}/books/${editBookId}`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Book updated successfully!");
      } else {
        await axios.post(`${API_URL}/books`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Book added successfully!");
      }

      setFormData({
        title: "",
        author: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        image: null,
      });
      setEditBookId(null);
      if (imageInputRef.current) imageInputRef.current.value = null;
      fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error("Error while saving book.");
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      description: book.description,
      category: book.category,
      stock: book.stock,
      image: null,
    });
    setEditBookId(book._id);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const token =
        user?.token || JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        toast.warning("You need to be logged in to delete a book.");
        return;
      }

      await axios.delete(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the book.");
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 w-full min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        {editBookId ? "Edit Book" : "Add New Book"}
      </h2>

      {user && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 shadow-xl rounded-xl max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            {editBookId ? "Edit Book Details" : "Add a New Book"}
          </h3>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter book title"
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Enter author name"
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Rs.0.00"
                className="w-full border border-gray-300 p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="e.g. 20"
                className="w-full border border-gray-300 p-3 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief summary of the book"
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Book Cover</label>
            <input
              ref={imageInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            {editBookId ? "Update Book" : "Add Book"}
          </button>
        </form>
      )}

      <div className="my-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by book title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg"
        />
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-800">All Books</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
              <p className="text-sm text-gray-600 mb-1">Price: Rs.{book.price}</p>
              <p className="text-sm text-gray-600 mb-1">Category: {book.category}</p>
              <p className="text-sm text-gray-600 mb-1">Stock: {book.stock}</p>
              <p className="text-sm text-gray-600">Description: {book.description}</p>

              {book.image && (
                <img
                  src={`${API_URL.replace("/api", "")}/uploads/${book.image}`}
                  alt={book.title}
                  className="mt-4 rounded w-full h-40 object-cover"
                />
              )}
            </div>

            {user && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(book)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id, book.title)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBooks;
