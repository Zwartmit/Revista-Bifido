'use client';

import React, { useState, useEffect, useCallback } from 'react';

export const BottomPreviewToggle: React.FC = () => {
    const [isLivePreviewing, setIsLivePreviewing] = useState<boolean>(false);

    // Comprobar el estado real de Live Preview en el DOM
    const checkState = useCallback(() => {
        if (typeof document === 'undefined') return;

        const mainEl = document.querySelector('main.collection-edit');
        const togglerBtn = document.getElementById('live-preview-toggler');
        const previewWin = document.querySelector('.live-preview-window') as HTMLElement | null;

        const isPreviewActive = Boolean(
            mainEl?.classList.contains('collection-edit--is-live-previewing') ||
            togglerBtn?.classList.contains('live-preview-toggler--active') ||
            (previewWin && window.getComputedStyle(previewWin).display !== 'none' && previewWin.offsetHeight > 50)
        );

        setIsLivePreviewing(isPreviewActive);
    }, []);

    useEffect(() => {
        checkState();

        // Observar cambios en el DOM para mantener el estado sincronizado con el botón superior
        const observer = new MutationObserver(() => {
            checkState();
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'style'],
            subtree: true,
        });

        const timer = setInterval(checkState, 400);

        return () => {
            observer.disconnect();
            clearInterval(timer);
        };
    }, [checkState]);

    // Función para activar o desactivar la vista previa
    const handleToggle = () => {
        if (typeof document === 'undefined') return;

        const togglerBtn = document.getElementById('live-preview-toggler') as HTMLButtonElement | null;

        if (togglerBtn) {
            const nextState = !isLivePreviewing;
            setIsLivePreviewing(nextState);

            // Simular click en el toggler nativo de Payload
            togglerBtn.click();

            if (nextState) {
                // Si se está activando, desplazar suavemente hacia la vista previa inferior
                setTimeout(() => {
                    const previewWin = document.querySelector('.live-preview-window');
                    if (previewWin) {
                        previewWin.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 250);
            }

            // Re-sincronizar tras actualización del DOM de Payload
            setTimeout(checkState, 80);
            setTimeout(checkState, 250);
        } else {
            console.warn('[BottomPreviewToggle] No se encontró el botón nativo #live-preview-toggler.');
        }
    };

    return (
        <div className="bifido-bottom-preview-wrapper">
            <button
                type="button"
                onClick={handleToggle}
                className={`bifido-btn-bottom-preview ${isLivePreviewing ? 'bifido-btn-bottom-preview--active' : ''}`}
                title={isLivePreviewing ? 'Ocultar vista previa' : 'Mostrar vista previa'}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}
                >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                {isLivePreviewing ? 'Ocultar vista previa' : 'Mostrar vista previa'}
            </button>
        </div>
    );
};

export default BottomPreviewToggle;
