'use client';

import React, { useState, useEffect } from 'react';
import { useField } from '@payloadcms/ui';

export const ColorPicker: React.FC<{ path: string }> = ({ path }) => {
    const { value, setValue } = useField<string>({ path });
    const [localValue, setLocalValue] = useState(value || '');

    // Sync local value if value changes from outside
    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    // Debounce the Payload setValue so it doesn't lag while dragging the color picker
    useEffect(() => {
        const handler = setTimeout(() => {
            if (localValue !== (value || '')) {
                setValue(localValue);
            }
        }, 150);
        return () => clearTimeout(handler);
    }, [localValue, value, setValue]);

    const handleClear = () => {
        setLocalValue('');
        setValue(''); // Clear immediately
    };

    return (
        <div className="field-type" style={{ marginBottom: '1.5rem' }}>
            <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF', fontSize: '0.8rem' }}>
                Color del Botón
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '4px', 
                    overflow: 'hidden',
                    border: '1px solid #374151'
                }}>
                    <input
                        type="color"
                        value={localValue || '#000000'}
                        onChange={(e) => setLocalValue(e.target.value)}
                        style={{ width: '200%', height: '200%', transform: 'translate(-25%, -25%)', padding: '0', border: 'none', cursor: 'pointer' }}
                    />
                </div>
                <input 
                    type="text" 
                    value={localValue} 
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder="Color del Personaje"
                    className="payload-input"
                    style={{ 
                        padding: '0.5rem 1rem', 
                        flex: 1, 
                        border: '1px solid var(--theme-elevation-150)', 
                        background: 'var(--theme-elevation-50)',
                        color: 'var(--theme-text)',
                        fontFamily: 'monospace',
                        borderRadius: '4px' 
                    }}
                />
                <button 
                    type="button" 
                    onClick={handleClear} 
                    style={{ 
                        padding: '0.5rem 1rem', 
                        cursor: 'pointer', 
                        background: 'transparent', 
                        border: '1px solid var(--theme-elevation-150)', 
                        color: 'var(--theme-text)',
                        borderRadius: '4px' 
                    }}
                >
                    Borrar
                </button>
            </div>
            <p style={{ marginTop: '0.5rem', color: '#6B7280', fontSize: '0.8rem' }}>Selecciona un color o déjalo vacío para usar el color por defecto del personaje.</p>
        </div>
    );
};
