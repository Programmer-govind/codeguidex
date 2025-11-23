/**
 * Error Message Component
 * Displays error messages with styling
 */

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  type = 'error',
}) => {
  const bgColorClasses = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColorClasses = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const iconColorClasses = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <div
      className={`border rounded-lg p-4 flex items-start justify-between ${bgColorClasses[type]}`}
    >
      <div className="flex items-start">
        <div className={`${iconColorClasses[type]} mt-0.5`}>
          {type === 'error' && '✕'}
          {type === 'warning' && '!'}
          {type === 'info' && 'ℹ'}
        </div>
        <p className={`ml-3 ${textColorClasses[type]}`}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`ml-3 font-medium ${textColorClasses[type]} hover:opacity-75`}
        >
          ✕
        </button>
      )}
    </div>
  );
};
