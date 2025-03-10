import React, { useContext, useState } from 'react';
import axiosApiInstance from '../utils/axiosUtility';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { token, setUser } = useContext(AuthenticationContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let toast_id = null;
    try {
      toast_id = toast.loading("Logging in...");
      const response = await axiosApiInstance.post('/auth/login', {
        username,
        password,
      });
      if (response.status === 200) {
        toast.success("Logged in successfully!", { id: toast_id, duration: 2000 });
        clearCart();
        setUser(response.data);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to login", { id: toast_id });
      console.error(error?.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-lg rounded-2xl border border-gray-200 ">
        <div className="w-full max-w-md p-8 space-y-6 bg-white">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-2 px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 mt-1 border  border-gray-300  rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 px-4 py-3 cursor-pointer font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Login
            </button>
          </form>
        </div>
      </div></>
  );
};

export default Login;