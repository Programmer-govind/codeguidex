import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

/**
 * Premium Input component using the .input-field utility defined in globals.css.
 */
export const Input: React.FC<InputProps> = ({ className = '', ...rest }) => {
    const base = 'input-field';
    return <input className={`${base} ${className}`.trim()} {...rest} />;
};
