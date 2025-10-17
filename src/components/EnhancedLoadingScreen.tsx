
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EnhancedLoadingScreenProps {
  message?: string;
}

const EnhancedLoadingScreen: React.FC<EnhancedLoadingScreenProps> = ({ 
  message = 'Loading...'
}) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50">
      <img 
        src="/lovable-uploads/a6c0688c-3d7c-4c2c-adb3-e41170f23cb4.png" 
        alt="5Y Connect Logo" 
        className="h-16 w-auto mb-8 animate-pulse"
      />
      <div className="flex items-center justify-center mb-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mr-3" />
        <h1 className="text-2xl font-bold">{message}</h1>
      </div>
      <div className="w-64 sm:w-96 mb-4">
        <Progress value={progress} className="h-2" />
      </div>
      <p className="text-muted-foreground">{progress}% complete</p>
    </div>
  );
};

export default EnhancedLoadingScreen;
