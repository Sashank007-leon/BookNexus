import Order from "../models/orderModel.js";
import Book from "../models/bookModel.js";

// Place an order
export const placeOrder = async (req, res) => {
  const { items, totalAmount } = req.body;
  const userId = req.user._id;

  try {
    const books = await Book.find({ _id: { $in: items.map(item => item.book) } });

    for (const book of books) {
      const orderedItem = items.find(item => item.book.toString() === book._id.toString());
      if (book.stock < orderedItem.quantity) {
        return res.status(400).json({ message: "Not enough stock for one or more books." });
      }
    }

    // Decrease stock
    for (const book of books) {
      const orderedItem = items.find(item => item.book.toString() === book._id.toString());
      await Book.findByIdAndUpdate(book._id, { $inc: { stock: -orderedItem.quantity } });
    }

    const order = new Order({
      user: userId,
      items: items.map(item => ({
        book: item.book,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order." });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.book", "title author price image");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders." });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("items.book", "title author price image");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders." });
  }
};

// ✅ Unified Order Update (status & paymentStatus)
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ message: "Order updated successfully.", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order." });
  }
};

// ✅ Delete order & restore stock
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // Restore stock before deleting
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, { $inc: { stock: item.quantity } });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted and stock restored." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order." });
  }
};
