
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";

// Enhanced query client configuration with better navigation support
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 5)
      gcTime: 5 * 60 * 1000, // 5 minutes (reduced from 10)
      // Critical: Always refetch on mount for better navigation experience
      refetchOnMount: true,
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      // Refetch when reconnecting
      refetchOnReconnect: true,
      // More aggressive retry for navigation scenarios
      retry: (failureCount, error: any) => {
        // Don't retry auth-related errors
        if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
          return false;
        }
        // Allow up to 3 retries for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000), // Faster initial retry
      // Enhanced network mode for better offline/online handling
      networkMode: 'online',
    },
    mutations: {
      retry: false,
      networkMode: 'online',
    },
  },
});

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <UserPreferencesProvider>
            {children}
            <Toaster />
            <Sonner />
          </UserPreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProviders;
