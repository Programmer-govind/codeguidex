/**
 * Loading Spinner Component
 * Displays a loading indicator
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = fullPage
    ? 'fixed inset-0 flex items-center justify-center bg-black/50 z-50'
    : 'flex flex-col items-center justify-center py-8';

  return (
    <div className={containerClasses}>
      <div
        className={`${sizeClasses[size]} border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin`}
      />
      {message && <p className="mt-3 text-gray-600">{message}</p>}
    </div>
  );
};
