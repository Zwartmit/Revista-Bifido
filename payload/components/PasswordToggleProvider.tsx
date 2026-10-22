'use client';
import React, { useEffect } from 'react';

export const PasswordToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // ─── PASSWORD TOGGLE ─────────────────────────────────────────────────────────

    // ─── PASSWORD TOGGLE ─────────────────────────────────────────────────────────
    const injectToggles = () => {
      const passwordInputs = document.querySelectorAll('input[type="password"]:not([data-has-toggle="true"])');
      
      passwordInputs.forEach((input: any) => {
        input.setAttribute('data-has-toggle', 'true');
        
        const container = input.parentElement;
        if (!container) return;

        container.style.position = 'relative';
        
        const button = document.createElement('button');
        button.type = 'button';
        button.ariaLabel = 'Mostrar/Ocultar contraseña';
        
        Object.assign(button.style, {
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#ccfd29',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          zIndex: '10',
          transition: 'all 0.2s ease',
          opacity: '0.7',
          marginTop: '4px'
        });

        const eyeIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
        
        const eyeOffIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;

        button.innerHTML = eyeIcon;

        button.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          button.innerHTML = isPassword ? eyeOffIcon : eyeIcon;
          button.style.color = isPassword ? '#fff' : '#ccfd29';
        };

        button.onmouseenter = () => { button.style.opacity = '1'; };
        button.onmouseleave = () => { button.style.opacity = '0.7'; };

        container.appendChild(button);
      });
    };

    const observer = new MutationObserver(() => {
      injectToggles();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    injectToggles();
    // ─────────────────────────────────────────────────────────────────────────────

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
};
