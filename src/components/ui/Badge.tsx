import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    onClick?: () => void;
    removable?: boolean;
    onRemove?: () => void;
    className?: string;
}

/**
 * Premium Badge component with glassmorphism and gradient styling.
 * Uses the badge utility classes defined in globals.css.
 */
export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'primary',
    size = 'md',
    onClick,
    removable = false,
    onRemove,
    className = '',
}) => {
    const variantClasses = {
        primary: 'badge-primary',
        secondary: 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 dark:from-gray-700 dark:to-gray-800 dark:text-gray-200',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    const cursorClass = onClick || removable ? 'cursor-pointer hover:scale-105' : '';

    return (
        <div
            className={`badge inline-flex items-center gap-1.5 rounded-full font-semibold shadow-sm hover:shadow-md ${variantClasses[variant]} ${sizeClasses[size]} ${cursorClass} ${className}`.trim()}
            onClick={onClick}
        >
            <span>{label}</span>
            {removable && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                    className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Remove badge"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};
