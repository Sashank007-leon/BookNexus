import { useCart } from '../context/CartContext';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Cart</h1>
        <p className="text-gray-600 text-lg">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Your Shopping Cart</h1>
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row justify-between items-center gap-4 border rounded-lg p-6 shadow hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{item.title}</h2>
                <p className="text-gray-600">Author: {item.author}</p>
                <p className="text-gray-700 font-semibold mt-1">Price: Rs.{item.price}</p>
                <p className="text-sm text-gray-500">Stock: {item.stock}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button
                onClick={() => decreaseQuantity(item._id)}
                className={`p-2 rounded-full text-white ${item.quantity === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={item.quantity === 1}
              >
                <FaMinus />
              </button>
              <span className="text-lg font-bold">{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item._id)}
                className={`p-2 rounded-full text-white ${item.quantity === item.stock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={item.quantity === item.stock}
              >
                <FaPlus />
              </button>
              <p className="text-lg font-bold text-green-600 ml-4">
                Rs.{(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-600 hover:text-red-800 ml-2"
                title="Remove"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-between items-center border-t pt-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Total: <span className="text-green-600">${total.toFixed(2)}</span>
        </h2>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-medium shadow transition"
          >
            Clear Cart
          </button>
          <button
            onClick={handleProceedToCheckout}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium shadow transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
