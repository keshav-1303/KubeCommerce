import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi, setAuthToken } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await authApi.post('/login', { email, password })
      localStorage.setItem('token', data.token)
      setAuthToken(data.token)
      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  // Inline style objects
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,rgb(195, 225, 255) 0%,rgb(255, 226, 226) 100%)',
    padding: '20px'
  }

  const cardStyle = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    padding: '32px',
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  }

  const headingStyle = {
    fontSize: '28px',
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: '24px'
  }

  const labelStyle = {
    display: 'block',
    color: '#4a5568',
    marginBottom: '8px',
    fontSize: '14px'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none'
  }

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#3182ce',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  }

  const errorStyle = {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center'
  }

  const footerTextStyle = {
    textAlign: 'center',
    marginTop: '24px',
    color: '#718096',
    fontSize: '14px'
  }

  const linkStyle = {
    color: '#3182ce',
    textDecoration: 'none',
    fontWeight: '500'
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Welcome Back</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="email" style={labelStyle}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Log In</button>
        </form>
        <p style={footerTextStyle}>
          Don’t have an account?{' '}
          <Link to="/register" style={linkStyle}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
