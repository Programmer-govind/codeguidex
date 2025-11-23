/**
 * Badge Component
 * Displays small status/category indicators
 */

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  onClick,
  removable = false,
  onRemove,
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const cursorClass = onClick || removable ? 'cursor-pointer' : '';

  return (
    <div
      className={`inline-flex items-center gap-1 border rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${cursorClass}`}
      onClick={onClick}
    >
      <span>{label}</span>
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 font-bold hover:opacity-75"
        >
          ✕
        </button>
      )}
    </div>
  );
};
