import { useContext, useState } from "react";
import { Trash2 } from 'lucide-react';
import { CartContext } from "../context/CartContext";
import axiosApiInstance from "../utils/axiosUtility";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const Cart = () => {
  const { cart, setCart, clearCart } = useContext(CartContext);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2);

  const checkout = async (e) => {
    let toast_id = null;
    e.preventDefault();
    try {
      toast_id = toast.loading("Checking out...");
      const response = await axiosApiInstance.post('/items/pay/', cart.map((item) => ({
        id: item.id,
        price: item.price,
      })));
      if (response.status === 200) {
        clearCart();
        toast.success("Payment successful!", { id: toast_id, duration: 3000 });
        setTimeout(() => {
          navigate('/myitems?type=purchased');
        }, 1500);
      }
    } catch (error) {
      toast.error("Failed to checkout", { id: toast_id });
      console.log(error);
      if (error.status === 400) {
        const response = error?.response?.data?.error
        console.log(response);
        setErrors(response);
        let newProduct = response.find(error => error.detail === "Price has changed.");
        if (newProduct) {
          let newCart = cart.map((item) => {
            if (item.id === newProduct.id) {
              return {
                ...item,
                price: newProduct.new_price,
              };
            }
            return item;
          });
          updateCart(newCart);
        }
      }
    };
  }

  return (
    <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-4 border border-gray-200 rounded-lg 
              bg-gray-50 hover:shadow-md transition text-left"
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="font-semibold block text-gray-700">{item.title}</span>
                  <span className="text-sm text-gray-500">€{item.price}</span>
                </div>
                <button
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-300 cursor-pointer shadow-sm"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Error Message */}
              {errors.some(error => error.id === item.id) && (
                <span className="text-red-500 text-md mt-2">{errors.find(error => error.id === item.id).detail}</span>
              )}
            </div>

          ))}
        </div>
      )}
      <div className="mt-4 flex justify-between items-center pt-4">
        <span className="font-semibold">Total:</span>
        <span className="text-lg font-bold"> €{totalPrice}</span>
      </div>
      <button
        className="w-full mt-4 p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
        disabled={cart.length === 0}
        onClick={checkout}
      >
        Pay
      </button>
    </div>
  );
};

export default Cart;
