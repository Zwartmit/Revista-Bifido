'use client';

import React, { useEffect, useState } from 'react';

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Find the main scrolling container in Payload. Often it's the document root, but it can be a specific div.
            // We can check both window and the main payload element.
            const scrolled = window.scrollY > 300 || (document.querySelector('.payload-app') && document.querySelector('.payload-app')!.scrollTop > 300);
            setIsVisible(scrolled);
        };

        window.addEventListener('scroll', toggleVisibility, true); // true to capture scroll events from any container
        return () => window.removeEventListener('scroll', toggleVisibility, true);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Also try to scroll the payload inner container if it exists
        const scrollContainer = document.querySelector('.payload-app, main');
        if (scrollContainer) {
            scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Volver arriba"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 9999,
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: 'var(--theme-elevation-800)',
                color: 'var(--theme-elevation-0)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.3s, transform 0.3s',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-elevation-900)';
                e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-elevation-800)';
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="m18 15-6-6-6 6"/>
            </svg>
        </button>
    );
};
