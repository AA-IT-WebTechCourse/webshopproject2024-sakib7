import React, { useContext, useState } from 'react';
import axiosApiInstance from '../utils/axiosUtility';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { token, setUser } = useContext(AuthenticationContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let toast_id = null;
    try {
      toast_id = toast.loading("Changing password...");
      const response = await axiosApiInstance.put('/auth/account', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      if (response.status === 200) {
        toast.success("Password changed successfully!", { id: toast_id, duration: 2000 });
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to change password", { id: toast_id });
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-lg rounded-2xl border border-gray-200 ">
        <div className="w-full max-w-md p-8 space-y-6 bg-white">
          <h2 className="text-2xl font-bold text-center">Edit Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <input
                type="password"
                id="password1"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 mt-1 border  border-gray-300  rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 px-4 py-3 cursor-pointer font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Change Password
            </button>
          </form>
        </div>
      </div></>
  );
};

export default ChangePassword;