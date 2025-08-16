import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/products');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '30px',
      background: 'linear-gradient(135deg, #dceeff, #fefefe)',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        marginTop: '-200px',
        borderRadius: '16px',
        padding: '40px 30px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
        animation: 'fadeIn 0.5s ease-in-out'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#2d3748',
          marginBottom: '20px',
          fontWeight: '700'
        }}>
          🎉 Thank You for Your Purchase!
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#4a5568',
          lineHeight: '1.6',
          marginBottom: '15px'
        }}>
          Your order has been successfully placed.
        </p>
        <p style={{
          fontSize: '1.1rem',
          color: '#4a5568',
          lineHeight: '1.6'
        }}>
          We appreciate your business and hope you enjoy your new items.
        </p>
        <p style={{
          fontSize: '1rem',
          color: '#718096',
          marginTop: '30px'
        }}>
          ⏳ Redirecting you to the products page shortly...
        </p>
      </div>

      {/* Simple fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
