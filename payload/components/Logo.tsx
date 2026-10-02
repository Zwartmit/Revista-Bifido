import React from 'react';

export const Logo: React.FC = () => (
  <div className="logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', marginTop: '1rem' }}>
    <img
      src="/icons/bifido.svg"
      alt="Revista Bífido"
      style={{
        width: '280px',
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  </div>
);
