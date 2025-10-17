
import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavigationItem as NavigationItemType } from "./types";
import { useTierCheck } from "@/hooks/auth/use-tier-check";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  navigation: NavigationItemType[];
  isActive: (path: string) => boolean;
  onCloseMenu: () => void;
  onSignOut: () => void;
  getUserInitials: () => string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  user,
  navigation,
  isActive,
  onCloseMenu,
  onSignOut,
  getUserInitials,
}) => {
  if (!isOpen) return null;

  const renderNavigationItems = () => {
    const items: React.ReactNode[] = [];
    
    navigation.forEach((item) => {
      const { hasAccess } = useTierCheck(item.requiredTier || 'essential');
      
      if (!hasAccess && !item.isAdmin) return;

      // Add main item if it has a real href
      if (item.href !== '#') {
        items.push(
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
              isActive(item.href)
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={onCloseMenu}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      }

      // Add sub-items if they exist
      if (item.subItems && item.subItems.length > 0) {
        const accessibleSubItems = item.subItems.filter(subItem => {
          const { hasAccess: subHasAccess } = useTierCheck(subItem.requiredTier || 'essential');
          return subHasAccess;
        });

        // Add section header for sub-items if main item has no direct link
        if (item.href === '#' && accessibleSubItems.length > 0) {
          items.push(
            <div key={`${item.name}-header`} className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {item.name}
            </div>
          );
        }

        accessibleSubItems.forEach(subItem => {
          items.push(
            <Link
              key={subItem.href}
              to={subItem.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ml-4 ${
                isActive(subItem.href)
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={onCloseMenu}
            >
              <subItem.icon className="h-4 w-4" />
              <span>{subItem.name}</span>
            </Link>
          );
        });
      }
    });

    return items;
  };

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75" onClick={onCloseMenu} />
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-900">Menu</div>
          <Button variant="ghost" size="sm" onClick={onCloseMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium text-gray-900">
              {user?.email || "User"}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {renderNavigationItems()}
        </nav>

        <div className="border-t border-gray-200 px-4 py-4">
          <Link
            to="/profile"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={onCloseMenu}
          >
            <span>Profile</span>
          </Link>
          <button
            onClick={() => {
              onSignOut();
              onCloseMenu();
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
