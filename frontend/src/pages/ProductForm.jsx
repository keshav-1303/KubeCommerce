import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { productApi } from '../api'

export default function ProductForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('editId')

  useEffect(() => {
    if (!editId) return
    (async () => {
      try {
        const { data } = await productApi.get(`/products?page=1&limit=1000`)
        const prod = data.products.find((p) => p._id === editId)
        if (prod) {
          setName(prod.name)
          setDescription(prod.description)
          setPrice(prod.price)
          setCategory(prod.category || '')
          setStock(prod.stock || '')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load product for editing.')
      }
    })()
  }, [editId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { name, description, price, category, stock }
      if (editId) {
        await productApi.put(`/update/${editId}`, payload)
      } else {
        await productApi.post('/product', payload)
      }
      navigate('/products')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Save failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgb(195, 225, 255) 0%, rgb(255, 226, 226) 100%)',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(1px)',
        WebkitBackdropFilter: 'blur(1px)',
        borderRadius: '16px',
        
        padding: '32px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>
          {editId ? 'Edit Product' : 'Add Product'}
        </h2>
        {error && <p style={{ marginBottom: '16px', color: '#dc2626' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Name', value: name, setter: setName, type: 'text', placeholder: 'Product name' },
            { label: 'Description', value: description, setter: setDescription, type: 'text', placeholder: 'Short description' },
            { label: 'Price', value: price, setter: setPrice, type: 'number', placeholder: '₹ Price' },
            { label: 'Category', value: category, setter: setCategory, type: 'text', placeholder: 'e.g., Electronics' },
            { label: 'Stock', value: stock, setter: setStock, type: 'number', placeholder: 'Available stock' },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label}>
              <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                placeholder={placeholder}
                style={{
                  width: '94%',
                  padding: '10px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  outline: 'none'
                }}
              />
            </div>
          ))}
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            {editId ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  )
}
