
import { cva } from "class-variance-authority"

// Create variants for menubar items for consistent styling
export const menubarItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      inset: {
        true: "pl-8",
        false: ""
      }
    },
    defaultVariants: {
      inset: false
    }
  }
)
