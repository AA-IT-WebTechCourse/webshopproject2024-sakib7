import React, { useContext, useState } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { Link, useNavigate } from 'react-router';
import { ShoppingCart, UserPen } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import axiosApiInstance from '../utils/axiosUtility';
import { toast } from 'sonner';

const NavBar = () => {
  const { user, clearUser } = useContext(AuthenticationContext);
  const { cart, clearCart } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    clearCart();
  }

  const handlePopulateDB = async () => {
    let toast_id = null;
    try {
      toast_id = toast.loading("Populating database...");
      const response = await axiosApiInstance.post('/items/populate_db/');
      if (response.status === 201) {
        console.log(response.data);
        clearUser();
        clearCart();
        navigate('/');
        toast.success("Database populated successfully!", { id: toast_id });
      }
    } catch (error) {
      console.log(error);
      toast.success("Failed to populate", { id: toast_id });
    }
  }


  return (
    <header className="bg-blue-600 p-4">

      <nav className="container mx-auto px-20 flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold cursor-pointer hover:text-gray-300">Shop</Link>
        <button className="text-white md:hidden cursor-pointer hover:text-gray-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Menu"}
        </button>

        <ul className={`md:flex md:space-x-4 absolute md:static bg-blue-600 md:bg-transparent w-full left-0 top-16 md:top-0 md:w-auto flex-col md:flex-row items-center p-4 md:p-0 transition-all ${isOpen ? "flex" : "hidden"}`}>

          <Link to="#" className="bg-red-300 border border-red-500 text-red-800 p-1 rounded mr-20" onClick={handlePopulateDB}>Populate DB</Link>

          {user?.token ?
            <>
              <Link to="/cart" className="text-white hover:text-gray-300 relative">
                <div className="flex items-center">
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {
                      cart.length > 0 &&
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {cart.length}
                      </div>
                    }

                  </div>
                  <span className="ml-2">Cart</span>
                </div>
              </Link>
              <Link to="/myitems" className="text-white hover:text-gray-300">My Items</Link>
              <Link to="/profile" className="text-white hover:text-gray-300"> {user?.username}</Link>
              <Link to="#" className="text-white hover:text-gray-300" onClick={handleLogout}>Logout</Link>
            </>
            :
            <>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
              <Link to="/signup" className="text-white hover:text-gray-300">Register</Link>
            </>

          }

        </ul>
      </nav>
    </header>
  );
};

export default NavBar;