import React, { useContext } from 'react';
import { useEffect, useState } from 'react';
import axiosApiInstance from '../utils/axiosUtility';
import { format, parseISO } from "date-fns";
import { CartContext } from '../context/CartContext';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { cart, addToCart } = useContext(CartContext);
  const { user } = useContext(AuthenticationContext);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      let param = "";
      if (search === "") {
        param = "";
      } else {
        param = `?search=${search}`;
      }
      const response = await axiosApiInstance.get(`/items/${param}`);
      setProducts(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "An error occurred");
      console.error(error);
    }
  }


  return (
    <>
      <div className="container mx-auto p-6 px-30">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product List</h1>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {products
            .filter((product) => product.seller !== user?.user_id)
            .map((product) => (
              <div key={product.id} className="max-w-sm rounded-2xl overflow-hidden shadow-xl bg-white p-5 border border-gray-200 transition duration-300 transform hover:scale-105 hover:shadow-2xl text-left">
                <img
                  className="w-full h-48 object-cover rounded-xl"
                  src={"https://placehold.co/400"}
                  alt={product.title}
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{product.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <p className="text-gray-500 text-xs mb-4">Added on: {format(parseISO(product.date_added), "d MMM y, h:mm aaa")}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-semibold text-green-600"> € {product.price}</span>

                  </div>
                  {
                    user?.token && (
                      <button
                        className={`mt-4 w-full py-2 rounded-xl font-semibold transition duration-300 transform 
                      ${cart.some((item) => item.id === product.id)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg hover:scale-105 cursor-pointer"}
                    `}
                        onClick={() => {
                          addToCart(product);
                        }}
                        disabled={cart.some((item) => item.id === product.id)}
                      >
                        Add to Cart
                      </button>
                    )
                  }
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;