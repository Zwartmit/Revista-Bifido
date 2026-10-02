'use client';
import React from 'react';
import Link from 'next/link';

export const BackToSiteButton: React.FC = () => {
    return (
        <div style={{ marginTop: '0.75rem', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    background-image: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/backgrounds/team_desk.png') !important;
                    background-size: cover !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                    background-attachment: fixed !important;
                    --theme-bg: #000000 !important;
                    --theme-text: #ffffff !important;
                    --theme-primary: #ccfd29 !important;
                    --theme-input-bg: #111111 !important;
                    --theme-input-border: #333333 !important;
                    background-color: #000 !important;
                    color: #fff !important;
                }
                @media (max-width: 767px) {
                    body {
                        background-image: linear-gradient(rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.92)), url('/backgrounds/team_movil.jpeg') !important;
                    }
                }
                /* Also force logo and headers to be white/neon */
                h1 { color: var(--theme-primary) !important; }
                /* Make login form text larger and more visible */
                .field-label, label, .field-type {
                    font-size: 1.1rem !important;
                    color: var(--theme-text) !important;
                }
                .field-type input {
                    font-size: 1.1rem !important;
                    padding: 0.75rem 1rem !important;
                }
                a, .btn {
                    font-size: 1.05rem !important;
                }
                
                /* Centrar el formulario y limitar su ancho */
                form {
                    max-width: 360px !important;
                    margin: 0 auto !important;
                    width: 100% !important;
                }
                
                /* Forzar ancho completo de los campos de correo y contraseña */
                .field-type {
                    width: 100% !important;
                    display: block !important;
                    margin-right: 0 !important;
                    margin-left: 0 !important;
                }

                /* Arreglar el fondo blanco horrible del Autocompletar de Chrome */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #111111 inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s !important;
                }

                /* Hacer que el ojito de la contraseña (y otros iconos) sea más visible */
                button[type="button"] svg {
                    color: #ffffff !important;
                    stroke: #ffffff !important;
                    opacity: 0.8 !important;
                }
                
                /* Ancho completo para botón de login */
                .form-submit {
                    margin-top: 0.5rem !important;
                    width: 100% !important;
                }
                .form-submit button {
                    width: 100% !important;
                    margin: 0 !important;
                    display: block !important;
                }

                /* Reducir espacio debajo de olvidar contraseña si existe */
                .forgot-password {
                    margin-bottom: 0.5rem !important;
                }
            ` }} />
            <Link 
                href="/" 
                style={{ 
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    color: '#a0a0a0', 
                    textDecoration: 'none', 
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                    padding: '0.5rem 0'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
            >
                ← Volver a la página principal
            </Link>
        </div>
    );
};
