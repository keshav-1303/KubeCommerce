import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { setAuthToken } from '../api'

export default function Navbar() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    setAuthToken(null)
    navigate('/login')
  }

  // Inline styles
  const navStyle = {
    position: 'sticky',
    top: 0,
    left: 0,
    width: '100vw',                // full viewport width
    boxSizing: 'border-box',       // include padding
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    overflowX: 'hidden'            // prevent horizontal scroll
  }

  const brandStyle = {
    fontSize: '26px',
    fontWeight: '600',
    color: '#2d3748',
    textDecoration: 'none'
  }

  const linkContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  }

  const linkStyle = {
    fontSize: '16px',
    color: '#3182ce',
    textDecoration: 'none',
    fontWeight: '500'
  }

  const buttonStyle = {
    fontSize: '16px',
    padding: '6px 12px',
    backgroundColor: '#e53e3e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>KubeCommerce</Link>
      <div style={linkContainerStyle}>
        <Link to="/products" style={linkStyle}>Products</Link>
        <button onClick={handleLogout} style={buttonStyle}>Logout</button>
      </div>
    </nav>
  )
}
