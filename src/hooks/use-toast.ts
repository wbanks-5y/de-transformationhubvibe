
import { toast } from "sonner";
import type { Toast, ToastActionElement } from "@/components/ui/use-toast";
export { useToast } from "@/components/ui/use-toast";

// Re-export toast directly from sonner
export { toast };

// Re-export types
export type {
  Toast,
  ToastActionElement,
};
