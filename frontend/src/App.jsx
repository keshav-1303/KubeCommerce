import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Admin from './pages/Admin'
import Payment from './pages/Payment'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/products"
            element={<ProtectedRoute><Products /></ProtectedRoute>}
          />
          <Route
            path="/products/new"
            element={<ProtectedRoute><ProductForm /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<AdminRoute><Admin /></AdminRoute>}
          />
          <Route
            path="/payment"
            element={<ProtectedRoute><Payment /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
      </div>
    </div>
  )
}
