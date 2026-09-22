'use client';
import React from 'react';
import Link from 'next/link';

export const BackToSiteButton: React.FC = () => {
    return (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <Link 
                href="/" 
                style={{ 
                    color: '#a0a0a0', 
                    textDecoration: 'none', 
                    fontSize: '14px',
                    transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
            >
                ← Volver a la página principal
            </Link>
        </div>
    );
};
