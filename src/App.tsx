
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { OrganizationProvider } from '@/context/OrganizationContext';
import { AuthProvider } from '@/context/AuthContext';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import BootstrapAdminNotification from '@/components/auth/BootstrapAdminNotification';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <OrganizationProvider>
          <AuthProvider>
            <UserPreferencesProvider>
              <div className="min-h-screen bg-background">
                <AppRoutes />
                <BootstrapAdminNotification />
                <Toaster />
              </div>
            </UserPreferencesProvider>
          </AuthProvider>
        </OrganizationProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
