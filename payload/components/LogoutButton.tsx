'use client';
import React from 'react';
import { useAuth } from '@payloadcms/ui';

export const LogoutButton: React.FC = () => {
  const auth = useAuth();
  
  // In Payload 3.0, the function is 'logOut' (camelCase)
  const logOut = auth?.logOut;

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      if (typeof logOut === 'function') {
        try {
          await logOut();
          // Explicitly redirect to login after successful logout hook call
          window.location.href = '/admin/login';
        } catch (err) {
          console.error('Error logging out via hook:', err);
          window.location.href = '/admin/logout';
        }
      } else {
        // Direct hit to Payload's logout route which clears session and redirects
        window.location.href = '/admin/logout';
      }
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="nav__link"
      style={{
        background: 'none',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.6)',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s ease',
        borderRadius: '8px',
        margin: '0.5rem 0',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#ccfd29';
        e.currentTarget.style.backgroundColor = 'rgba(204, 253, 41, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span className="nav__link-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1='21' x2='9' y1='12' y2='12'></line></svg>
      </span>
      <span className="nav__link-label">Cerrar sesión</span>
    </button>
  );
};
