
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const AdminLoadingState = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 15000); // Show timeout message after 15 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center max-w-md mx-auto px-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
        <p className="text-lg font-medium mb-2">Checking admin permissions...</p>
        <p className="text-muted-foreground text-sm">This may take a moment</p>
        
        {showTimeout && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              This is taking longer than expected. Please try refreshing the page or contact support if the issue persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoadingState;
