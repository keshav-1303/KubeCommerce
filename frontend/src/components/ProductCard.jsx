import React from 'react'
import { useNavigate } from 'react-router-dom'
import { productApi } from '../api'

export default function ProductCard({ product, onDeleted, userRole }) {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/products/new?editId=${product._id}`)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this product?')) return
    try {
      await productApi.delete(`/delete/${product._id}`)
      onDeleted(product._id)
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Could not delete product.')
    }
  }

  const handleBuy = () => {
    navigate('/payment');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(240, 247, 255, 0.7), rgba(255, 247, 247, 0.7))',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(1px)',
      borderRadius: '12px',
      boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '160px'
    }}>
      <div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '4px',
          color: '#1a202c'
        }}>
          {product.name}
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#4a5568'
        }}>
          {product.description}
        </p>
      </div>
      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          color: '#2563eb',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          ₹{product.price}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(userRole === 'admin' || userRole === 'employee') && (
            <button onClick={handleEdit} style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              background: 'white',
              cursor: 'pointer'
            }}>
              Edit
            </button>
          )}
          {userRole === 'admin' && (
            <button onClick={handleDelete} style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #f56565',
              background: 'white',
              color: '#e53e3e',
              cursor: 'pointer'
            }}>
              Delete
            </button>
          )}
          {userRole === 'user' && (
            <button onClick={handleBuy} style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #4CAF50',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer'
            }}>
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

  
