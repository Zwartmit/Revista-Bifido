'use client';
import React from 'react';
import { useAuth, useTheme } from '@payloadcms/ui';

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

  const { theme, setTheme } = useTheme();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', margin: '0.5rem 0' }}>
      {/* Botón de Cerrar Sesión */}
      <button 
        onClick={handleLogout}
        className="nav__link"
        title="Cerrar sesión"
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer',
          flex: 1,
          textAlign: 'left',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.2s ease',
          borderRadius: '8px',
          margin: 0,
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
        <span className="nav__link-label">Salir</span>
      </button>

      {/* Botón de Tema (Icono) */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          borderRadius: '8px',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ccfd29';
          e.currentTarget.style.backgroundColor = 'rgba(204, 253, 41, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(204, 253, 41, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        }}
      >
        {theme === 'dark' ? (
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        )}
      </button>
    </div>
  );
};
