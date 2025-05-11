import Cart from "../models/cartModel.js";
import Book from "../models/bookModel.js";

// Get cart for logged-in user
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  res.json(cart || { items: [] });
};

// Add book to cart
export const addToCart = async (req, res) => {
  const { bookId, quantity } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
  }

  const existingItem = cart.items.find((item) => item.bookId.equals(bookId));

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ bookId, title: book.title, quantity });
  }

  await cart.save();
  res.json(cart);
};

// Update quantity
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const bookId = req.params.id;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find((item) => item.bookId.equals(bookId));
  if (!item) return res.status(404).json({ message: "Item not found in cart" });

  item.quantity = quantity;
  await cart.save();

  res.json(cart);
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  const bookId = req.params.id;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((item) => !item.bookId.equals(bookId));
  await cart.save();

  res.json(cart);
};

// Clear cart
export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user._id });
  res.json({ message: "Cart cleared" });
};
