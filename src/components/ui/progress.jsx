// src/components/ui/progress.jsx
import React from 'react';

export function Progress({ value }) {
  return (
    <div style={{ background: '#eee', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
      <div style={{
        width: `${value}%`,
        height: '100%',
        background: '#7367F0',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}
