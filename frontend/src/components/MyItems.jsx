import React from 'react';
import { useEffect, useState } from 'react';
import axiosApiInstance from '../utils/axiosUtility';
import { format, parseISO } from "date-fns";
import { Link, useSearchParams } from 'react-router';
import { PlusCircle } from 'lucide-react';

const MyItems = () => {
  const [products, setProducts] = useState({});
  const [filter, setFilter] = useState("on_sale");
  const [filters, setFilters] = useState([
    { key: "on_sale", label: "On Sale" },
    { key: "sold", label: "Sold" },
    { key: "purchased", label: "Purchased" },
  ]);
  let [searchParams] = useSearchParams();

  useEffect(() => {
    console.log(searchParams.get("type"));

    searchParams.get("type") && setFilter(searchParams.get("type"));
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const response = await axiosApiInstance.get('/items/my_items/');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <>

      <div className="container mx-auto p-6 px-30">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Items</h1>
        <div className="flex justify-between items-center mb-6">

          <div className="flex justify-center space-x-4 mb-6">
            {filters.map((item) => (
              <button
                key={item.key}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer
                ${filter === item.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
              `}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </button>
            ))}

          </div>
          <div className="flex justify-center mb-6">
            <Link
              to="/create-product"
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 
          hover:from-green-600 hover:to-green-700 text-white font-semibold px-5 py-3 rounded-xl 
          transition duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create New Product</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products[filter]?.map((product) => (
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
                  <span className="text-lg font-semibold text-green-600">${product.price}</span>
                  {/* <span className="text-sm text-gray-500">
                    Seller: <span className="font-medium text-gray-700">{product.seller}</span>
                  </span> */}
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {filters.find((item) => item.key === filter).label}
                  </span>

                </div>
                {
                  filter === "on_sale" && (
                    <Link
                      to={`/myitems/${product.id}`}
                      className="mt-4 inline-block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-xl transition duration-300 transform hover:scale-105 hover:shadow-lg" >
                      Edit
                    </Link>
                  )
                }
              </div>
            </div>
          ))}
        </div>
      </div >
    </>
  );
};

export default MyItems;