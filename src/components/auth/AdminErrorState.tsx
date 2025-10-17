
interface AdminErrorStateProps {
  onRetry?: () => void;
  message?: string;
  canRetry?: boolean;
  sessionValid?: boolean;
}

const AdminErrorState = ({ onRetry, message, canRetry = true, sessionValid = true }: AdminErrorStateProps) => {
  const getDefaultMessage = () => {
    if (!sessionValid) {
      return "Your session has expired or is about to expire. Please refresh the page to log in again.";
    }
    return "There was a problem verifying your admin access. This might be due to database connectivity issues.";
  };
  
  const getTitle = () => {
    if (!sessionValid) {
      return "Session Expired";
    }
    return "Database Connection Issue";
  };

  const getTroubleshootingSteps = () => {
    if (!sessionValid) {
      return [
        "• Refresh the page to re-authenticate",
        "• Check if you're still logged in",
        "• Try logging out and back in"
      ];
    }
    return [
      "• Check your internet connection",
      "• Verify database configuration in Admin → Database Management", 
      "• Try refreshing the page"
    ];
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-md mx-auto px-4">
        <div className={`rounded-full p-3 mb-4 ${sessionValid ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">{getTitle()}</h2>
        <p className="text-muted-foreground mb-4">
          {message || getDefaultMessage()}
        </p>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {getTroubleshootingSteps().map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>
        <div className="flex gap-4">
          {onRetry && canRetry && sessionValid && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Retry Connection
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            {sessionValid ? 'Refresh Page' : 'Refresh & Re-login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminErrorState;
