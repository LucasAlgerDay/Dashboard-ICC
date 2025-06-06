// src/components/ui/card.jsx
import React from 'react';

export function Card({ children }) {
  return <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px #ccc' }}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
