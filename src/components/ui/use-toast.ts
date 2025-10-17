
import { toast as sonnerToast } from "sonner";

// We're exporting toast directly from sonner
export const toast = sonnerToast;

// Create a useToast hook compatible with both sonner and shadcn interfaces
export const useToast = () => {
  return {
    toast: sonnerToast,
    // Mock the toasts array for compatibility with shadcn Toaster
    toasts: [] 
  };
};

export type Toast = {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export type ToastActionElement = React.ReactElement;
