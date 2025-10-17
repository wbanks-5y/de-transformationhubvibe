
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface SessionRefreshButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const SessionRefreshButton: React.FC<SessionRefreshButtonProps> = ({
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    console.log('Manual refresh button clicked');
    setIsRefreshing(true);
    
    try {
      // Clear cache and refetch
      console.log('Clearing query cache...');
      queryClient.clear();
      
      // Wait a moment then invalidate all queries
      setTimeout(() => {
        console.log('Invalidating all queries...');
        queryClient.invalidateQueries();
      }, 500);
      
      console.log('Refresh complete');
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={className}
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
};

export default SessionRefreshButton;
