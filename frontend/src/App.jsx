import { useState } from 'react'
import { AuthenticationProvider } from './context/AuthenticationContext'
// import './App.css'
import NavBar from './router/NavBar'
import { BrowserRouter } from 'react-router'
import AppRouter from './router/AppRouter'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'sonner'


function App() {

  return (
    <>
      <BrowserRouter>
        <CartProvider>
          <AuthenticationProvider>
            <NavBar />
            <AppRouter />
            <Toaster theme='light' />
          </AuthenticationProvider>
        </CartProvider>
      </BrowserRouter>

    </>
  )
}

export default App
