import Book from "../models/bookModel.js";
import Review from "../models/reviewModel.js";
import { deleteImageFile } from "../middlewares/uploadMiddleware.js";
import path from "path";

// Get all books
export const getBooks = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new book with image support
export const addBook = async (req, res) => {
  try {
    const { title, author, price, description, category, stock } = req.body;
    const image = req.file ? req.file.filename : null;
    console.log(req.body);
    const newBook = new Book({
      title,
      author,
      price,
      description,
      category,
      stock,
      image,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update book with image support
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // If a new image is uploaded, delete the old one
    if (req.file) {
      if (book.image) {
        deleteImageFile(path.join("uploads", book.image));
      }
      book.image = req.file.filename;
    }

    // Update other fields
    const { title, author, price, description, category, stock } = req.body;
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (price !== undefined) book.price = price;
    if (description !== undefined) book.description = description;
    if (category !== undefined) book.category = category;
    if (stock !== undefined) book.stock = stock;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete book with image deletion
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Delete image from storage if it exists
    if (book.image) {
      deleteImageFile(path.join("uploads", book.image));
    }

    await book.deleteOne();
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBooksWithAverageRating = async (req, res) => {
  try {
    const books = await Book.find();

    // Calculate average rating for each book
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ book: book._id });
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = reviews.length
          ? (totalRating / reviews.length).toFixed(1)
          : 0;

        return { ...book.toObject(), averageRating: parseFloat(averageRating) };
      })
    );

    res.json(booksWithRatings);
  } catch (err) {
    console.error("Error fetching books with ratings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
