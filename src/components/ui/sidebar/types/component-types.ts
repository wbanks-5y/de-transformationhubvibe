
import { type VariantProps } from "class-variance-authority"
import { sidebarMenuButtonVariants } from "../sidebar-menu-button"

export interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentPropsWithoutRef<"div">
  variant?: VariantProps<typeof sidebarMenuButtonVariants>["variant"]
  size?: VariantProps<typeof sidebarMenuButtonVariants>["size"]
}

