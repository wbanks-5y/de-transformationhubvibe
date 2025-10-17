
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTierCheck } from '@/hooks/auth/use-tier-check';
import { useCachedAdminCheck } from '@/hooks/auth/use-cached-admin-check';
import NavigationDropdown from './NavigationDropdown';
import type { NavigationItem as NavItem } from './types';

interface NavigationItemProps {
  item: NavItem;
  isMobile?: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ item, isMobile = false, onClick }) => {
  const location = useLocation();
  const { isAdmin } = useCachedAdminCheck();
  const { hasAccess } = useTierCheck(item.requiredTier || 'essential');
  
  const isActive = location.pathname === item.href || 
    (item.href !== '/' && item.href !== '#' && location.pathname.startsWith(item.href));

  // Check if user should see this item
  const shouldShow = item.isAdmin ? isAdmin : hasAccess;
  
  if (!shouldShow) {
    return null;
  }

  // For desktop with subItems, use dropdown
  if (!isMobile && item.subItems && item.subItems.length > 0) {
    return <NavigationDropdown item={item} isActive={(path) => isActive} />;
  }

  // For mobile or items without subItems, render as regular link
  const baseClasses = cn(
    "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors",
    isActive
      ? "bg-indigo-100 text-indigo-700"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  );

  const mobileClasses = cn(baseClasses, "text-base");
  const desktopClasses = cn(baseClasses, "text-sm");

  // Don't render links with href="#" for mobile without subItems
  if (isMobile && item.href === '#') {
    return null;
  }

  return (
    <Link
      to={item.href}
      className={isMobile ? mobileClasses : desktopClasses}
      onClick={onClick}
    >
      <item.icon
        className={cn(
          "mr-4 flex-shrink-0 h-6 w-6",
          isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
        )}
        aria-hidden="true"
      />
      {item.name}
    </Link>
  );
};

export default NavigationItem;
