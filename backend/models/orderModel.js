import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },  // Store price at the time of order
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Cancelled'] },
  paymentStatus: { type: String, default: 'Unpaid', enum: ['Unpaid', 'Paid'] }, // Assuming payment tracking
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
