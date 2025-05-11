import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const token = user?.token;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders);
    } catch (err) {
      toast.error("Failed to load orders");
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      await axios.patch(
        `${API_URL}/order/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const handlePaymentUpdate = async (orderId, paymentStatus) => {
    try {
      await axios.patch(
        `${API_URL}/order/${orderId}`,
        { paymentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Payment status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update payment status");
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`${API_URL}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Order deleted");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center">Loading orders...</p>;

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6 text-center">Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-xl">No orders available.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-6 shadow-lg bg-white"
            >
              <div className="mb-4 text-sm text-gray-600">
                <span className="font-semibold">Order Date:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </div>

              <div className="mb-4">
                <span className="font-semibold">User:</span> {order.user?.name}{" "}
                ({order.user?.email})
              </div>

              <div className="mb-4">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-medium ${
                    order.status === "Completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                <span className="font-semibold">Payment:</span>{" "}
                <select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    handlePaymentUpdate(order._id, e.target.value)
                  }
                  className="border rounded px-3 py-2 text-sm bg-gray-100"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="mb-4">
                <span className="font-semibold">Items:</span>
                <ul className="ml-4 list-disc mt-1 space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <img
                        src={`${API_URL.replace("/api", "")}/uploads/${
                          item.book.image
                        }`}
                        alt={item.book.title}
                        className="w-20 h-24 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold">{item.book.title}</span>
                        <span>
                          × {item.quantity} - Rs.{item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4 font-semibold">
                Total Amount: Rs.{order.totalAmount.toFixed(2)}
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleToggleStatus(order._id, order.status)}
                  className={`px-6 py-2 rounded-full text-white ${
                    order.status === "Completed"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {order.status === "Completed"
                    ? "Mark as Pending"
                    : "Mark as Completed"}
                </button>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  Delete Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
