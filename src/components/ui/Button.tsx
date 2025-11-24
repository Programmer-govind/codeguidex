import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
}

/**
 * Premium Button component that maps to the utility classes defined in globals.css.
 * - primary → btn-primary
 * - secondary → btn-secondary
 * - outline → btn-outline
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...rest
}) => {
    const variantClass = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
    }[variant];

    const sizeClass = {
        sm: 'text-sm py-1 px-3',
        md: 'text-base py-2 px-4',
        lg: 'text-lg py-3 px-5',
    }[size];

    const base = `${variantClass} ${sizeClass}`;
    return (
        <button className={`${base} ${className}`.trim()} {...rest}>
            {children}
        </button>
    );
};
