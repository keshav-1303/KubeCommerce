import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { setAuthToken } from './api'

// If there’s a saved token in localStorage, apply it now:
const token = localStorage.getItem('token')
if (token) {
  console.log('Applying saved JWT to Axios headers')
  setAuthToken(token)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
