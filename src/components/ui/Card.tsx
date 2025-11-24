import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Premium Card component using the glass‑morphism utility defined in globals.css.
 * It adds a subtle backdrop blur, rounded corners and a soft shadow.
 */
export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    const base = 'glass-card p-6';
    return <div className={`${base} ${className}`.trim()}>{children}</div>;
};
