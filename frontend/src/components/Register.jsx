import React, { useContext, useState } from 'react';
import axiosApiInstance from '../utils/axiosUtility';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'sonner';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { token, setUser } = useContext(AuthenticationContext);
  const { cart, clearCart } = useContext(CartContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let toast_id = null;
    try {
      toast_id = toast.loading("Signing up...");
      const response = await axiosApiInstance.post('/auth/register', {
        username,
        password,
        email,
      });
      if (response.status === 200) {
        setUser(response.data);
        clearCart();
        toast.success("Signed up successfully!", { id: toast_id, duration: 4000 });
      }
      setUser(response.data);
    } catch (error) {
      toast.error("Failed to sign up.\n" + JSON.stringify(error?.response?.data), { id: toast_id });

      console.error(error?.response?.data || 'An error occurred');
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-lg rounded-2xl border border-gray-200 ">
        <div className="w-full max-w-md p-8 space-y-6 bg-white">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
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
              Sign Up
            </button>
          </form>
        </div>
      </div></>
  );
};

export default Register;