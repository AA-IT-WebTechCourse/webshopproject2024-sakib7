import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Login from '../components/Login';
import Home from '../components/Home';
import MyItems from '../components/MyItems';
import ProductForm from '../components/ProductForm';
import Cart from '../components/Cart';
import Register from '../components/Register';
import ChangePassword from '../components/ChangePassword';
import { AuthenticationContext } from '../context/AuthenticationContext';

const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthenticationContext);

  return user?.token ? element : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/" element={<Home />} />

      <Route path="/myitems" element={
        <PrivateRoute
          element={<MyItems />}
        />} />
      <Route path="/create-product" element={
        <PrivateRoute
          element={<ProductForm />}
        />
      } />
      <Route path="/myitems/:productId" element={
        <PrivateRoute
          element={<ProductForm edit />}
        />
      } />
      <Route path='/cart' element={
        <PrivateRoute
          element={<Cart />}
        />
      } />
      <Route path='/profile' element={
        <PrivateRoute
          element={<ChangePassword />}
        />
      } />
    </Routes>
  );
};

export default AppRouter;