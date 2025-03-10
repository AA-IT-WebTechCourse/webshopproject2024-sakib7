import { useEffect, useState } from "react";
import { Euro } from "lucide-react";
import axiosApiInstance from "../utils/axiosUtility";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function ProductForm({ product, edit = false }) {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || "",
  });

  useEffect(() => {
    if (edit) { fetchProduct(productId); }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (edit) {
      updateProduct(formData);
    } else {
      createProduct(formData);
    };
  }

  const createProduct = async (formData) => {
    let toast_id = null;
    try {
      toast_id = toast.loading("Creating product...");
      const response = await axiosApiInstance.post("/items/", formData);
      if (response.status === 201) {
        toast.success("Product created successfully!", { id: toast_id, duration: 2000 });
        navigate('/myitems');
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "An error occurred", { id: toast_id });
    }
  }

  const updateProduct = async (formData) => {
    let toast_id = null;
    try {
      toast_id = toast.loading("Updating product...");
      const response = await axiosApiInstance.patch(`/items/${productId}/`, {
        price: formData.price,
      });
      if (response.status === 200) {
        toast.success("Product updated successfully!", { id: toast_id, duration: 2000 });
        navigate('/myitems');
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "An error occurred", { id: toast_id });
    }
  }

  const fetchProduct = async (id) => {
    try {
      const response = await axiosApiInstance.get(`/items/${id}/`);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        price: response.data.price,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-2xl border border-gray-300">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        {edit ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div>
          <label className="block text-gray-800 font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={formData.title}
            className={`w-full px-4 py-3 border rounded-lg shadow-sm 
              ${edit
                ? "bg-gray-100 cursor-not-allowed border-gray-300"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"}`}
            placeholder="Enter product title"
            disabled={edit}
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold mb-1">Item Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={formData.description}
            className={`w-full px-4 py-3 border rounded-lg shadow-sm 
              ${edit
                ? "bg-gray-100 cursor-not-allowed border-gray-300"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"}`}
            placeholder="Enter product description"
            rows="4"
            disabled={edit}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-800 font-semibold mb-1">Price</label>
          <div className="relative">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Enter product price"
              required
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
              <Euro size={20} />
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          {edit ? "Update Product" : "Submit Product"}
        </button>
      </form>
    </div>
  );
}
