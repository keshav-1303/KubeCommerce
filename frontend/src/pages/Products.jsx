import React, { useEffect, useState } from 'react'
import { productApi } from '../api'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'

export default function Products() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const response = await productApi.get('/products?page=1&limit=20')
        setProducts(response.data.products || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load products.')
      }
    })()
  }, [])

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id))
  }

  // Inline styles
  const pageStyle = {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, rgb(195, 225, 255) 0%, rgb(255, 226, 226) 100%)'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)' 
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  }

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3748'
  }

  const addButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#38a169',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  }

  const messageStyle = {
    textAlign: 'center',
    color: '#4a5568',
    marginTop: '24px',
    fontSize: '16px'
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Products</h2>
          <Link to="/products/new" style={addButtonStyle}>+ Add Product</Link>
        </div>

        {error && <p style={{ ...messageStyle, color: '#c53030' }}>{error}</p>}

        <div style={gridStyle}>
          {products.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              onDeleted={removeProduct}
            />
          ))}
        </div>

        {products.length === 0 && !error && (
          <p style={messageStyle}>No products found.</p>
        )}
      </div>
    </div>
  )
}
