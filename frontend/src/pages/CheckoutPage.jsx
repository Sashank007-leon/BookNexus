import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cart.map((item) => ({
        book: item._id,           
        quantity: item.quantity,
        price: item.price,        
      }));
  
      const totalAmount = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
  
      await axios.post(
        `${API_URL}/order`,
        { items: orderItems, totalAmount }, 
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, 
          },
        }
      );
  
      clearCart();
      toast.success("Order placed successfully!");
      // navigate("/order-success");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Order failed. Please try again."
      );
    }
  };  

  if (!cart.length) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold">No items in your cart</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Checkout
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Order Summary
        </h2>
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center mb-4"
          >
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-semibold">
              Rs.{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span className="text-green-600">Rs.{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default CheckoutPage;
